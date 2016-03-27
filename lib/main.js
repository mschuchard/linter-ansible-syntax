"use babel";

//TODO: travisci; jasmine babel

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
        const path = require('path');
        //TODO: line and col may never show up in the error message and, if they do, the mesage spans multiple lines
        //TODO: this regex captures both errors and warnings correctly but then only the first warning or error is being output
        //const regex = /(ERROR!|WARNING]:)\s(.*)/;
        const regex = /(ERROR!)\s(.*)/;
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

        return helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), args, {stream: 'stderr', cwd: path.dirname(file)}).then(output => {
          var toReturn = [];
          //TODO: when the line and col are displayed, they are on a separate line and therefore the split by newline and match regex is not going to work
          output.split('\r?\n').forEach(function (line) {
            const matches = regex.exec(line);
            if (matches != null) {
              toReturn.push({
                type: matches[1] == 'ERROR!' ? 'Error' : 'Warning',
                range: 1,
                text: matches[2],
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
