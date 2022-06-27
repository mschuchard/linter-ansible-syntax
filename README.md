![Preview]

### Linter-Ansible-Syntax
[![Badge Status]][Travis]

`Linter-Ansible-Syntax` aims to provide functional and robust Ansible syntax check linting functionality within Atom.

### Atom Editor Sunset Updates

`apm` was discontinued prior to the sunset by the Atom Editor team. Therefore, the installation instructions are now as follows:

- Locate the Atom packages directory on your filesystem (normally at `<home>/.atom/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom packages directory.
- Execute `npm install` in the package directory.

Additionally, this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented. However, active development on this package has ceased.

### Installation
Ansible version >= 2.0 is required to be installed before using this. The Linter and Language-Ansible Atom packages are also required.

### Usage
- The Ansible syntax check only outputs the first error it encounters, and therefore only the first error in a playbook will be displayed.
- The Ansible syntax check functionality is only operable on a playbook. If your playbook contains roles and/or includes anywhere in the playbook, then these will be checked as well.
- To quickly and easily access issues in other files, you will need to change the settings inside Linter-UI-Default. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.


<!----------------------------------------------------------------------------->

[Travis]: https://travis-ci.com/mschuchard/linter-ansible-syntax

[Preview]: resources/Preview.png


<!----------------------------------[ Badge ]---------------------------------->

[Badge Status]: https://travis-ci.com/mschuchard/linter-ansible-syntax.svg?branch=master