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
      }
    },
    modulePaths: {
      title: 'Module Paths',
      type: 'array',
      description: 'Additional module path(s) to module library.',
      default: [],
      items: {
        type: 'string'
      }
    }
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
            detail: "Please upgrade your version of Ansible to >= 2.0.\n",
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
        if (!(/hosts:/.exec(textEditor.getText())))
          return [];

        // setup variables
        const helpers = require('atom-linter');
        const file = textEditor.getPath();

        // setup reg exps for output parsing
        const regexError = /ERROR!\s(.*)/;
        const regexWarning = /WARNING\]:\s(.*)/;
        const regexRange = /line\s(\d+),\scolumn\s(\d+)/;
        const regexFile = /The error appears to (?:have been|be) in '(.*)':/;

        // setup standard initial arguments
        var args = ['--syntax-check'];

        // add host inventory
        if (atom.config.get('linter-ansible-syntax.hostInventory') !== '')
          args.push(...['-i', atom.config.get('linter-ansible-syntax.hostInventory')]);

        // add vault password file
        if (atom.config.get('linter-ansible-syntax.vaultPassFile') !== '')
          args.push(...['--vault-password-file', atom.config.get('linter-ansible-syntax.vaultPassFile')]);

        // add extra variables
        if (atom.config.get('linter-ansible-syntax.extraVars')[0] !== '')
          for (i = 0; i < atom.config.get('linter-ansible-syntax.extraVars').length; i++)
            args.push(...['-e', atom.config.get('linter-ansible-syntax.extraVars')[i]]);

        // add extra module paths
        if (atom.config.get('linter-ansible-syntax.modulePaths')[0] !== '')
          for (i = 0; i < atom.config.get('linter-ansible-syntax.modulePaths').length; i++)
            args.push(...['-M', atom.config.get('linter-ansible-syntax.modulePaths')[i]]);

        // add the file to be checked
        args.push(file);

        // initialize toReturn
        var toReturn = [];

        return helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), args, {cwd: require('path').dirname(file), stream: 'stderr', allowEmptyStderr: true}).then(output => {
          // capture the error
          const matchesError = regexError.exec(output);

          // check if the output is guessing at which file has the issue; if so, capture the file name with an issue if it is elsewhere
          const matchesFile = regexFile.exec(output);
          theFile = (matchesFile == null) ? file : matchesFile[1];

          // check for error
          if (matchesError != null) {
            // check if the output is guessing at the issue location; if so, capture the issue location
            const matchesRange = regexRange.exec(output);
            var theRange = [[0, 0], [0, 1]];

            if (matchesRange != null) {
              theRange = [[Number.parseInt(matchesRange[1]) - 1, Number.parseInt(matchesRange[2]) - 1], [Number.parseInt(matchesRange[1]) - 1, Number.parseInt(matchesRange[2])]]
            }

            toReturn.push({
              severity: 'error',
              excerpt: matchesError[1],
              location: {
                file: theFile,
                position: theRange,
              },
            });
          }
          // check for warnings
          output.split(/\r?\n/).forEach((line) => {
            // capture the warning
            const matchesWarning = regexWarning.exec(line);

            if (matchesWarning != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: matchesWarning[1] + '.',
                location: {
                  file: theFile,
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
          }
          // notify on other errors
          else {
            atom.notifications.addError(
              'An error occurred with the package linter-ansible-syntax.',
              {detail: error.message}
            );
          };
          return toReturn;
        });
      }
    };
  }
};
