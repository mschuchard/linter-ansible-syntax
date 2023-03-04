![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-syntax/master/linter_ansible_syntax.png)

### Linter-Ansible-Syntax
[![Build Status](https://travis-ci.com/mschuchard/linter-ansible-syntax.svg?branch=master)](https://travis-ci.com/mschuchard/linter-ansible-syntax)

`Linter-Ansible-Syntax` aims to provide functional and robust Ansible syntax check linting functionality within Atom/Pulsar.

### APM (Atom) and PPM (Pulsar) Support

`apm` was discontinued prior to the sunset by the Atom Editor team. `ppm` for Pulsar does not yet support package publishing. Therefore, the installation instructions are now as follows if you want the latest version in Atom, Atom Beta, or Atom Dev:

- Locate the Atom or Pulsar packages directory on your filesystem (normally at `<home>/.{atom,pulsar}/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom or Pulsar packages directory.
- Execute `npm install` in the package directory (requires NPM).
- Repeat for any missing or outdated dependencies.

and Pulsar:

- Install the old version of the package as usual with either PPM or the GUI installer in the editor.
- Locate the Atom or Pulsar packages directory on your filesystem (normally at `<home>/.{atom,pulsar}/packages`)
- Replace the `lib/main.js` file in the package directory with the file located in this remote Github repository.

Additionally: this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented (especially bug fixes). However, active development on this package has ceased.

### Installation
Ansible version >= 2.0 is required to be installed before using this. The Linter and Language-Ansible Atom packages are also required.

Note that at this current time the package unit tests (outside of CI which will be Atom Beta `1.61.0` for the time being) and acceptance testing are performed with the latest stable version of Pulsar.

### Usage
- The Ansible syntax check only outputs the first error it encounters, and therefore only the first error in a playbook will be displayed.
- The Ansible syntax check functionality is only operable on a playbook. If your playbook contains roles and/or includes anywhere in the playbook, then these will be checked as well.
- To quickly and easily access issues in other files, you will need to change the settings inside Linter-UI-Default. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.
