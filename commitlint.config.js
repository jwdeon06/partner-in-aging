module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Code style changes (formatting, etc)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Tests
        'chore',    // Build, dependencies, etc
        'ci',       // CI/CD changes
        'revert'    // Revert changes
      ]
    ],
    'scope-case': [0],
    'subject-case': [0]
  }
};