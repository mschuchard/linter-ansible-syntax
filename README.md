![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-syntax/master/linter_ansible_syntax.png)

### Linter-Ansible-Syntax
[![Build Status](https://travis-ci.com/mschuchard/linter-ansible-syntax.svg?branch=master)](https://travis-ci.com/mschuchard/linter-ansible-syntax)

`Linter-Ansible-Syntax` aims to provide functional and robust Ansible syntax check linting functionality within Atom.

### Installation
Ansible version >= 2.0 is required to be installed before using this. The Linter and Language-Ansible Atom packages are also required.

### Usage
- The Ansible syntax check only outputs the first error it encounters, and therefore only the first error in a playbook will be displayed.
- The Ansible syntax check functionality is only operable on a playbook. If your playbook contains roles and/or includes anywhere in the playbook, then these will be checked as well.
- To quickly and easily access issues in other files, you will need to change the settings inside Linter-UI-Default. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.
