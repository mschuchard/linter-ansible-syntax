'use babel';

import * as path from 'path';

describe('The Ansible Syntax Check provider for Linter', () => {
  const lint = require(path.join(__dirname, '../lib/main.js')).provideLinter().lint;

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

    it('finds two messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toMatch(/this task 'hg' has extra params, which is only allowed in the following modules:/);
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+error_line_col\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[7, 4], [7, 5]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('warning');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toMatch(/Included file '.*linter-\./);
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+error_line_col\.yml$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file that would throw a YAML syntax error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'yaml_syntax.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the error message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('We were unable to read either as JSON nor YAML, these are the errors we got from each:');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+yaml_syntax\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[9, 0], [9, 1]]);
        });
      });
    });
  });

  describe('checks a file with an issue in an include and', () => {
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

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('failed at splitting arguments, either an unbalanced jinja2 block or quotes: name=ansible state={{present}');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+error_included\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[2, 2], [2, 3]]);
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
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toMatch(/Included file/);
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+missing_include\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    const goodFile = path.join(__dirname, 'fixtures', 'clean.yml');
    return atom.workspace.open(goodFile).then(editor =>
      lint(editor).then(messages => {
        expect(messages.length).toEqual(0);
      })
    );
  });

  it('ignores an included file', (done) => {
    const goodFile = path.join(__dirname, 'fixtures', 'included_clean.yml');
    return atom.workspace.open(goodFile).then(editor =>
      lint(editor).then(=> {
      }, () => {
        done();
      })
    );
  });
});
