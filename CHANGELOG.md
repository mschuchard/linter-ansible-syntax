### 1.3.0 (Roadmap)
- Bump minimum supported version to 2.0.

- unreadable file test from ansible-lint causes error sometimes because conflict between packages?
- check on all of lint's fixtures

### 1.2.3
- Change linter scope to project level.
- Capture new wording in output describing file with error.
- Only parse for one error in output (efficiency improvement).

### 1.2.2
- Updated `atom-linter` dependency.
- Catch linting on nonexistent files.

### 1.2.1
- Added `ansible-advanced` to source scope.

### 1.2.0
- Switched to using Linter v2 API.
- Removed `atom-package-deps` dependency and functionality.

### 1.1.4
- Config description additions.
- Earlier termination on non-playbook files.
- Now uses `ansible.cfg` located in directory of playbook if it exists.
- The host inventory config setting is now used only when a custom value is entered.

### 1.1.3
- Added option for using an Ansible-Vault password file while linting.
- Fixed undefined return for non-playbook Ansible files.

### 1.1.2
- Removed range 1 where unnecessary.
- Errors for files which are included or roles from the playbook are now displayed.

### 1.1.1
- Updated `atom-linter` dependency.
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
