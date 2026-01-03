# Contributing to MaxiEditor

Thank you for your interest in contributing to MaxiEditor! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Git
- Basic knowledge of JavaScript and DOM APIs

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/maxi-editor.git
   cd maxi-editor
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `test/` - Tests
- `refactor/` - Code refactoring

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add JSDoc comments
- Write tests for new features
- Update documentation

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test file
npm test -- maxi-editor.test.js

# Watch mode
npm test -- --watch
```

### 4. Commit Your Changes

Use conventional commit messages:

```
type(scope): short description

Longer description if needed.

Fixes #123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `style` - Code style (formatting)
- `chore` - Maintenance

**Examples:**
```
feat(plugins): add emoji picker plugin
fix(sanitizer): handle edge case in URL validation
docs(readme): update installation instructions
test(core): add tests for getStats method
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### JavaScript

- Use ES6+ features
- Use `const` and `let`, not `var`
- Use arrow functions where appropriate
- Use template literals for strings
- Add semicolons
- Use 2 spaces for indentation

### JSDoc Comments

```javascript
/**
 * Brief description
 * @param {Type} paramName - Description
 * @returns {Type} - Description
 */
function example(paramName) {
  // implementation
}
```

### File Organization

```
src/
├── core/           # Core editor functionality
├── commands/       # Command implementations
├── ui/             # UI components
├── utils/          # Utility functions
└── plugins/        # Plugin implementations
```

## Testing Guidelines

### Unit Tests

- Test individual functions and methods
- Mock dependencies
- Use descriptive test names
- Aim for 80%+ code coverage

```javascript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = method(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Integration Tests

- Test complete workflows
- Test plugin integration
- Test error handling
- Test edge cases

## Plugin Development

### Creating a Plugin

```javascript
export class MyPlugin {
  static init(editor) {
    // Register commands
    editor.registerCommand('myCommand', () => {
      // Implementation
    });

    // Cleanup
    const originalDestroy = editor.destroy.bind(editor);
    editor.destroy = () => {
      // Plugin cleanup
      originalDestroy();
    };
  }
}
```

### Plugin Guidelines

- Keep plugins focused and single-purpose
- Handle errors gracefully
- Clean up resources in destroy()
- Document configuration options
- Provide usage examples

## Documentation

### README Updates

- Keep installation instructions current
- Add examples for new features
- Update feature list
- Maintain changelog

### API Documentation

- Document all public methods
- Include parameter types
- Provide usage examples
- Note breaking changes

## Pull Request Process

### Before Submitting

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] JSDoc comments added
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code

### PR Description

Include:
1. **What** - What does this PR do?
2. **Why** - Why is this change needed?
3. **How** - How does it work?
4. **Testing** - How was it tested?
5. **Screenshots** - If UI changes

### Review Process

1. Automated tests run
2. Code review by maintainers
3. Address feedback
4. Approval and merge

## Reporting Issues

### Bug Reports

Include:
- MaxiEditor version
- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Code example (if applicable)

### Feature Requests

Include:
- Use case
- Proposed solution
- Alternative solutions
- Additional context

## Questions?

- Open an issue for questions
- Check existing issues first
- Be specific and provide context

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MaxiEditor! 🎉
