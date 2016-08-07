![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-syntax/master/linter_ansible_syntax.png)

### Linter-Ansible-Syntax
`Linter-Ansible-Syntax` aims to provide functional and robust `Ansible` syntax check linting functionality within Atom.

### Installation
`Ansible` is required to be installed (preferably from a package or a pip) before using this.  The `Linter` and `Language-Ansible` atom packages are also required but should be automatically installed as dependencies thanks to steelbrain's `package-deps`.

### Usage
- The `ansible-playbook --syntax-check` output sometimes does not output line and column information for errors. When it guesses the line and column, then that information will be displayed. If it does not, the error will be displayed at line 1, column 1.
- The first warning and deprecation warning will be displayed at line 1, column 1. There is never line and column information for these.
- The `Ansible` syntax check only outputs the first error it encounters and therefore only the first error in a playbook will be displayed.
- The `Ansible` syntax check does not understand how to parse task lists that are included as part of a playbook (including roles) and will display `'attribute' is not a valid attribute for a Play` in those instances.
