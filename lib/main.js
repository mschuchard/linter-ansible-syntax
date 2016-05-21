"use babel";

//TODO: travisci; jasmine babel; work on issue with task lists that are includes

export default {
  config: {
    ansibleExecutablePath: {
      title: 'Ansible Playbook Executable Path',
      type: 'string',
      description: 'Path to Ansible Playbook executable (e.g. /usr/bin/ansible-playbook) if not in shell env path.',
      default: 'ansible-playbook'
    },
    defaultYaml: {
      title: 'Lint all YAML files with Ansible syntax check by default (requires reload or restart after changing).',
      type: 'boolean',
      default: false
    },
    hostInventory: {
      title: 'Host inventory file',
      type: 'string',
      default: '/etc/ansible/hosts'
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

  activate: () => {
    require('atom-package-deps').install('linter-ansible-syntax');
  },

  provideLinter: () => {
    return {
      name: 'Ansible',
      grammarScopes: atom.config.get('linter-ansible-syntax.defaultYaml') ? ['source.ansible', 'source.yaml'] : ['source.ansible'],
      scope: 'file',
      lintOnFly: false,
      lint: (activeEditor) => {
        const helpers = require('atom-linter');
        const regex_error = /ERROR!\s(.*)/;
        const regex_warning = /WARNING\]:\s(.*)/;
        const regex_range = /.*line\s(\d+),\scolumn\s(\d+).*/;
        const file = activeEditor.getPath();

        var args = ['--syntax-check', '-i', atom.config.get('linter-ansible-syntax.hostInventory')]
        if (atom.config.get('linter-ansible-syntax.extraVars')[0] !== '') {
          for (i = 0; i < atom.config.get('linter-ansible-syntax.extraVars').length; i++) {
            args = args.concat(['-e', atom.config.get('linter-ansible-syntax.extraVars')[i]]);
          }
        }
        if (atom.config.get('linter-ansible-syntax.modulePaths')[0] != '') {
          for (i = 0; i < atom.config.get('linter-ansible-syntax.modulePaths').length; i++) {
            args = args.concat(['-M', atom.config.get('linter-ansible-syntax.modulePaths')[i]]);
          }
        }
        args.push(file);

        return helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), args, {stream: 'stderr'}).then(output => {
          var the_range = 1;
          const matches_range = regex_range.exec(output);
          if (matches_range != null) {
            the_range = [[Number.parseInt(matches_range[1]) - 1, Number.parseInt(matches_range[2]) - 1], [Number.parseInt(matches_range[1]) - 1, Number.parseInt(matches_range[2])]];
          }

          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches_error = regex_error.exec(line);
            const matches_warning = regex_warning.exec(line);
            if (matches_error != null) {
              toReturn.push({
                type: 'Error',
                range: the_range,
                text: matches_error[1],
                filePath: file
              });
            }
            else if (matches_warning != null) {
              toReturn.push({
                type: 'Warning',
                range: 1,
                text: matches_warning[1],
                filePath: file
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
