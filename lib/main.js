"use babel";

//TODO: travisci; jasmine babel

export default {
  config: {
    ansibleExecutablePath: {
      title: 'Ansible Playbook Executable Path',
      type: 'string',
      description: 'Path to Ansible Playbook executable (e.g. /usr/bin/ansible-playbook) if not in shell env path',
      default: 'ansible-playbook'
    },
    defaultYaml: {
      title: 'Lint all YAML files with Ansible syntax check by default (requires reload or restart after changing).',
      type: 'boolean',
      default: false
    },
    hostInventory: {
      title: 'Host inventory file.',
      type: 'string',
      default: '/etc/ansible/hosts'
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
        const regex = /ERROR!\s(.*)/;
        const file = activeEditor.getPath();

        var args = ['--syntax-check', '-i', atom.config.get('linter-ansible-syntax.hostInventory'), file]

        return helpers.exec(atom.config.get('linter-ansible-syntax.ansibleExecutablePath'), args, {stream: 'stderr', cwd: path.dirname(file)}).then(output => {
          var toReturn = [];
          //TODO: when the line and col are displayed, they are on a separate line and therefore the split by newline and match regex is not going to work
          output.split('\r?\n').forEach(function (line) {
            const matches = regex.exec(line);
            if (matches != null) {
              toReturn.push({
                type: 'Error',
                range: 1,
                text: matches[1],
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
