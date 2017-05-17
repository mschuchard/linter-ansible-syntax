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

  provideLinter() {
    return {
      name: 'Ansible',
      grammarScopes: ['source.ansible'],
      scope: 'file',
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
        const regex_file = /The error appears to have been in '(.*)':/;

        // setup standard initial arguments
        var args = ['--syntax-check'];

        // add host inventory
        if (atom.config.get('linter-ansible-syntax.hostInventory') !== '')
          args = args.concat(['-i', atom.config.get('linter-ansible-syntax.hostInventory')]);

        // add vault password file
        if (atom.config.get('linter-ansible-syntax.vaultPassFile') !== '')
          args = args.concat(['--vault-password-file', atom.config.get('linter-ansible-syntax.vaultPassFile')]);

        // add extra variables
        if (atom.config.get('linter-ansible-syntax.extraVars')[0] !== '')
          for (i = 0; i < atom.config.get('linter-ansible-syntax.extraVars').length; i++)
            args = args.concat(['-e', atom.config.get('linter-ansible-syntax.extraVars')[i]]);

        // add extra module paths
        if (atom.config.get('linter-ansible-syntax.modulePaths')[0] !== '')
          for (i = 0; i < atom.config.get('linter-ansible-syntax.modulePaths').length; i++)
            args = args.concat(['-M', atom.config.get('linter-ansible-syntax.modulePaths')[i]]);

        // add the file to be checked
        args.push(file);

        return helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), args, {cwd: require('path').dirname(file), stream: 'stderr', allowEmptyStderr: true}).then(output => {
          // grab the line and col info if it is in the output
          var the_range = [[0, 0], [0, 1]];
          const matches_range = regex_range.exec(output);
          if (matches_range != null)
            the_range = [[Number.parseInt(matches_range[1]) - 1, Number.parseInt(matches_range[2]) - 1], [Number.parseInt(matches_range[1]) - 1, Number.parseInt(matches_range[2])]];

          // grab the included file if the error is elsewhere
          var the_file = file;
          const matches_file = regex_file.exec(output);
          if (matches_file != null)
            the_file = matches_file[1];

          // check for errors and warnings
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches_error = regex_error.exec(line);
            const matches_warning = regex_warning.exec(line);

            if (matches_error != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_error[1],
                location: {
                  file: the_file,
                  position: the_range,
                },
              });
            }
            else if (matches_warning != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: matches_warning[1] + '.',
                location: {
                  file: file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
