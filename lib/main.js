'use babel';

export default {
  config: {
    ansibleExecutablePath: {
      title: 'Ansible Playbook Executable Path',
      type: 'string',
      description: 'Path to Ansible Playbook executable (e.g. /usr/bin/ansible-playbook) if not in shell env path.',
      default: 'ansible-playbook',
    },
    hostInventory: {
      title: 'Host Inventory File',
      type: 'string',
      description: 'Location of the host inventory file (if not in ansible.cfg).',
      default: '',
    },
    vaultPassFile: {
      title: 'Ansible-Vault Password File',
      description: 'Location of an Ansible-Vault password file for decryption.',
      type: 'string',
      default: '',
    },
    extraVars: {
      title: 'Extra variables',
      type: 'array',
      description: 'Extra variables in format of key=value or YAML/JSON.',
      default: [],
      items: {
        type: 'string'
      },
    },
    modulePaths: {
      title: 'Module Paths',
      type: 'array',
      description: 'Additional module path(s) to module library.',
      default: [],
      items: {
        type: 'string',
      },
    },
  },

  // activate linter
  activate() {
    const helpers = require('atom-linter');

    // check for ansible-lint >= minimum version
    helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), ['--version']).then(output => {
      if (/ansible-playbook [01]\.\d+/.exec(output)) {
        atom.notifications.addWarning(
          'Ansible < 2.0 is unsupported. Backwards compatibility may exist, but is not guaranteed.',
          {
            detail: 'Please upgrade your version of Ansible to >= 2.0.',
            dismissable: true
          }
        );
      }
    });
  },

  deactivate() {
    this.idleCallbacks.forEach((callbackID) => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Ansible',
      grammarScopes: ['source.ansible', 'source.ansible-advanced'],
      scope: 'project',
      lintsOnChange: false,
      lint: async (textEditor) => {
        // bail out if not playbook
        if (!(/hosts:/.exec(textEditor.getText()))) return [];

        // setup variables
        const helpers = require('atom-linter');
        const file = textEditor.getPath();

        // setup standard initial arguments
        const args = ['--syntax-check'];

        // add host inventory
        if (atom.config.get('linter-ansible-syntax.hostInventory') !== '')
          args.push(...['-i', atom.config.get('linter-ansible-syntax.hostInventory')]);

        // add vault password file
        if (atom.config.get('linter-ansible-syntax.vaultPassFile') !== '')
          args.push(...['--vault-password-file', atom.config.get('linter-ansible-syntax.vaultPassFile')]);

        // add extra variables
        if (atom.config.get('linter-ansible-syntax.extraVars')[0] !== '')
          for (let i = 0; i < atom.config.get('linter-ansible-syntax.extraVars').length; i++)
            args.push(...['-e', atom.config.get('linter-ansible-syntax.extraVars')[i]]);

        // add extra module paths
        if (atom.config.get('linter-ansible-syntax.modulePaths')[0] !== '')
          for (let i = 0; i < atom.config.get('linter-ansible-syntax.modulePaths').length; i++)
            args.push(...['-M', atom.config.get('linter-ansible-syntax.modulePaths')[i]]);

        // add the file to be checked
        args.push(file);

        // initialize toReturn
        const toReturn = [];

        return helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), args, { cwd: require('path').dirname(file), stream: 'stderr', allowEmptyStderr: true }).then(output => {
          // capture the error
          const matchesError = /ERROR!\s(.*)/.exec(output);
          const matchesYAMLError = /Syntax Error while loading YAML\.\n\s*(.*)\n/;

          // check if the output is guessing at which file has the issue; if so, capture the file name with an issue if it is elsewhere
          const matchesFile = /The error appears to (?:have been|be) in '(.*)':/.exec(output);
          const theFile = (matchesFile == null) ? file : matchesFile[1];

          // check for error
          if (matchesError != null) {
            // check if the output is guessing at the issue location; if so, capture the issue location
            const matchesRange = /line\s(\d+),\scolumn\s(\d+)/.exec(output);
            let theRange = [[0, 0], [0, 1]];

            // parse range
            if (matchesRange != null) {
              theRange = [[Number.parseInt(matchesRange[1], 10) - 1, Number.parseInt(matchesRange[2], 10) - 1], [Number.parseInt(matchesRange[1], 10) - 1, Number.parseInt(matchesRange[2], 10)]];
            }

            toReturn.push({
              severity: 'error',
              // if this is a yaml syntax error, then replace the ansible error message with the yaml syntax error
              // there is a bizarre js bug occurring here due to obsolete node.js, and so null is checked on the first matcher instead
              excerpt: matchesYAMLError[1] == null ? matchesError[1] : matchesYAMLError[1],
              location: {
                file: theFile,
                position: theRange,
              },
            });
          }
          // check for warnings (no longer functions due to bug in legacy node in pulsar)
          output.split(/\r?\n/).forEach((line) => {
            // capture the warning
            const matchesWarning = /WARNING\]:\s(.*)/.exec(line);
            // these are annoying and pointless warnings within an editor
            const matchesIgnoreInventory = /No inventory was parsed/.exec(line);
            const matchesIgnoreHosts = /provided hosts list is empty/.exec(line);
            const matchesIgnorePattern = /not match supplied host pattern/.exec(line);

            if (matchesIgnoreInventory == null && matchesIgnoreHosts == null && matchesIgnorePattern == null && matchesWarning != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: matchesWarning[1] + '.',
                location: {
                  file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          return toReturn;
        })
        .catch(error => {
          // check for stdin lint attempt
          if (/\.dirname/.exec(error.message) != null) {
            toReturn.push({
              severity: 'info',
              excerpt: 'Ansible cannot reliably lint on stdin due to nonexistent pathing on includes and roles. Please save this playbook to your filesystem.',
              location: {
                file: 'Save this playbook.',
                position: [[0, 0], [0, 1]],
              },
            });
          } else { // notify on other errors
            atom.notifications.addError(
              'An error occurred with the package linter-ansible-syntax.',
              { detail: error.message }
            );
          }
          return toReturn;
        });
      }
    };
  }
};
