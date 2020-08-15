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

  provideLinter() {
    return {
      name: 'Ansible',
      grammarScopes: ['source.ansible', 'source.ansible-advanced'],
      scope: 'project',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // bail out if not playbook
        if (!(/hosts:/.exec(activeEditor.getText())))
          return [];

        // setup variables
        const helpers = require('atom-linter');
        const file = activeEditor.getPath();

        // setup reg exps for output parsing
        const regex_error = /ERROR!\s(.*)/;
        const regex_warning = /WARNING\]:\s(.*)/;
        const regex_range = /line\s(\d+),\scolumn\s(\d+)/;
        const regex_file = /The error appears to (?:have been|be) in '(.*)':/;

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

        return helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), args, {cwd: require('path').dirname(file), stream: 'stderr', allowEmptyStderr: true}).then(output => {
          // initialize toReturn
          var toReturn = [];

          // capture the error
          const matches_error = regex_error.exec(output);

          // check if the output is guessing at which file has the issue; if so, capture the file name with an issue if it is elsewhere
          const matches_file = regex_file.exec(output);
          the_file = (matches_file == null) ? file : matches_file[1];

          // check for error
          if (matches_error != null) {
            // check if the output is guessing at the issue location; if so, capture the issue location
            const matches_range = regex_range.exec(output);
            var the_range = [[0, 0], [0, 1]];

            if (matches_range != null) {
              the_range = [[Number.parseInt(matches_range[1]) - 1, Number.parseInt(matches_range[2]) - 1], [Number.parseInt(matches_range[1]) - 1, Number.parseInt(matches_range[2])]]
            }

            toReturn.push({
              severity: 'error',
              excerpt: matches_error[1],
              location: {
                file: the_file,
                position: the_range,
              },
            });
          }
          // check for warnings
          output.split(/\r?\n/).forEach((line) => {
            const matches_warning = regex_warning.exec(line);

            if (matches_warning != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: matches_warning[1] + '.',
                location: {
                  file: the_file,
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
              {
                detail: error.message
              }
            );
          };
          return [];
        });
      }
    };
  }
};
