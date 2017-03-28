### Next (Roadmap)
- Config description additions.
- Earlier termination on non-playbook files.
- Now uses `ansible.cfg` located in directory of playbook if it exists.
- travisci
- jasmine babel
- deprec warnings terminates early in display
- add rolepath option?
- make inventory hosts default empty string and add logic
- linter 2 api
- new interface stuff (linter-ui-default --> panel represents/statusbar represents --> entire project) in doc; click on line:col in panel for shortcut

### 1.1.3
- Added option for using an Ansible-Vault password file while linting.
- Fixed undefined return for non-playbook Ansible files.

### 1.1.2
- Removed range 1 where unnecessary.
- Errors for files which are included or roles from the playbook are now displayed.

### 1.1.1
- Updated atom-linter dependency.
- Linter now ignores includes and roles.
- Added severity key.
- Removed option to lint all yaml by default since `language-ansible` now identifies all `.yml` as Ansible.

### 1.1.0
- Added support in configuration for extra variables and module paths.
- Line and column information now displayed for situations when `ansible-playbook` guesses it.
- Warnings and deprecation warnings are now displayed.
- Minor code optimization.

### 1.0.0
- Initial version ready for wide usage.
