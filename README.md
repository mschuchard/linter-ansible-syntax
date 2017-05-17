![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-syntax/master/linter_ansible_syntax.png)

### Linter-Ansible-Syntax
[![Build Status](https://travis-ci.org/mschuchard/linter-ansible-syntax.svg?branch=master)](https://travis-ci.org/mschuchard/linter-ansible-syntax)

`Linter-Ansible-Syntax` aims to provide functional and robust `Ansible` syntax check linting functionality within Atom.

### Installation
`Ansible` is required to be installed (preferably from a package or a pip) before using this. The `Linter` and `Language-Ansible` Atom packages are also required.

### Usage
- In older versions of `Ansible`, the `ansible-playbook --syntax-check` output sometimes does not output line and column information for errors. When it guesses the line and column, then that information will be displayed. If it does not, the error will be displayed at line 1, column 1.
- There is never line and column information for warnings and deprecation warnings.
- The `Ansible` syntax check only outputs the first error it encounters and therefore only the first error in a playbook will be displayed.
- The `Ansible` syntax check functionality is only operable on a playbook. If your playbook contains roles and/or includes anywhere in the playbook, then these will be checked as well with recent versions of `Ansible`. You can quickly navigate to errors in includes and roles using the provided `Atom-Linter` shortcuts.
- To quickly and easily access issues in other files, you will need to change the settings inside `Linter-UI-Default`. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.
