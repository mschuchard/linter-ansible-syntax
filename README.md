![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-syntax/master/linter_ansible_syntax.png)

### linter-ansible-syntax
Linter-Ansible-Syntax aims to provide functional and robust Ansible syntax check linting functionality within Atom.  Adapted from my other linter plugins 'linter-puppet-parsing' and 'linter-ansible-linting'.

### Installation
Ansible is required to be installed (preferably from a package or a pip) before using this.  The 'linter' and 'language-ansible' atom packages are also required but should be automatically installed as dependencies thanks to steelbrain's package-deps.

### Usage
- Ansible syntax check also parses includes when linting.  This may cause unusual behavior in your editor.
- At the moment, the Ansible Playbook Syntax Check output has a highly variable format.  Eventually I will write code to fully capture the line and column when it is actually output, but for now the errors will always be displayed at line 1, col 1.
- The Ansible syntax check only outputs the first error it encounters and therefore only the first error in a playbook will be displayed.
