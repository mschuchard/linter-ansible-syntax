### Next (Roadmap)
- Removed range 1 where unnecessary.
- Errors for files which are included or roles from the playbook are now displayed.
- travisci
- jasmine babel
- work on linting task lists that are includes/roles from somewhere else (trick ansible with hosts and tasks present in include/role)
- ansible now checks includes (bad and missing situations followup)
- deprec warnings terminates early in display
- revise test for bad_include; remove fixture with no line or col information since that now has the info

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
