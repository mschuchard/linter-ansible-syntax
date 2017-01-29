'use babel';

import * as path from 'path';

describe('The Ansible Syntax Check provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-ansible-syntax');
      return atom.packages.activatePackage('language-ansible').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'clean.yml'))
      );
    });
  });

  describe('checks a file with multiple issues and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'error_line_col.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual("this task 'hg' has extra params, which is only allowed in the following modules: command, shell, script, include, include_vars, add_host, group_by, set_fact, raw, meta");
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+error_line_col\.yml$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[1].type).toBeDefined();
          expect(messages[1].type).toEqual('Warning');
          expect(messages[1].text).toBeDefined();
          expect(messages[1].text).toEqual('Instead of sudo/sudo_user, use become/become_user and');
          expect(messages[1].filePath).toBeDefined();
          expect(messages[1].filePath).toMatch(/.+error_line_col\.yml$/);
          expect(messages[1].range).toBeDefined();
          expect(messages[1].range.length).toBeDefined();
          expect(messages[1].range.length).toEqual(2);
          expect(messages[1].range).toEqual([[0, 0], [0, 32]]);
        });
      });
    });
  });

  describe('checks a file with an issue and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'bad_include.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Warning');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toMatch(/Included file/);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+bad_include\.yml$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
        });
      });
    });
  });

  describe('checks a file with an issue and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'missing_include.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Warning');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toMatch(/Included file/);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+missing_include\.yml$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
        });
      });
    });
  });

  describe('checks a file with multiple issues and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'error_warn.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual('failed at splitting arguments, either an unbalanced jinja2 block or quotes');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+error_warn\.yml$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[1].type).toBeDefined();
          expect(messages[1].type).toEqual('Warning');
          expect(messages[1].text).toBeDefined();
          expect(messages[1].text).toEqual('provided hosts list is empty, only localhost is available');
          expect(messages[1].filePath).toBeDefined();
          expect(messages[1].filePath).toMatch(/.+error_warn\.yml$/);
          expect(messages[1].range).toBeDefined();
          expect(messages[1].range.length).toBeDefined();
          expect(messages[1].range.length).toEqual(2);
          expect(messages[1].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[2].type).toBeDefined();
          expect(messages[2].type).toEqual('Warning');
          expect(messages[2].text).toBeDefined();
          expect(messages[2].text).toEqual('Instead of sudo/sudo_user, use become/become_user and');
          expect(messages[2].filePath).toBeDefined();
          expect(messages[2].filePath).toMatch(/.+error_warn\.yml$/);
          expect(messages[2].range).toBeDefined();
          expect(messages[2].range.length).toBeDefined();
          expect(messages[2].range.length).toEqual(2);
          expect(messages[2].range).toEqual([[0, 0], [0, 32]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'clean.yml');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });

  it('ignores an included file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'included_clean.yml');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
