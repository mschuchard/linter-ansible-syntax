### Next (Roadmap)
- Updated atom-linter dependency.
- Linter now ignores includes and roles.
- Added severity key.
- Removed option to lint all yaml by default since `language-ansible` now identifies all `.yml` as Ansible.
- travisci
- jasmine babel
- work on linting task lists that are includes from somewhere else
- ansible now checks includes (bad and missing situations followup)
- deprec warning on missing include makes warning regexp grumpy
- option to use ansible-lint for syntax checks

### 1.1.0
- Added support in configuration for extra variables and module paths.
- Line and column information now displayed for situations when `ansible-playbook` guesses it.
- Warnings and deprecation warnings are now displayed.
- Minor code optimization.

### 1.0.0
- Initial version ready for wide usage.
