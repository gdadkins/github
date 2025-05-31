# Contributing to CPAP Analytics

Thank you for your interest in contributing to CPAP Analytics! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing opinions and experiences

## How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use issue templates** when available
3. **Provide details**:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Python/Node versions)
   - Error messages and logs

### Suggesting Features

1. **Check the [TODO.md](TODO.md)** to see if it's already planned
2. **Open a discussion** first for major features
3. **Provide context**:
   - Use case and benefits
   - Potential implementation approach
   - Mockups or examples if applicable

### Contributing Code

#### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/cpap-analytics.git
cd cpap-analytics
git remote add upstream https://github.com/ORIGINAL_OWNER/cpap-analytics.git
```

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

Use prefixes:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code refactoring
- `test/` for test additions

#### 3. Set Up Development Environment

Follow the [Installation Guide](docs/getting-started/installation.md) to set up your development environment.

#### 4. Make Your Changes

- **Follow code patterns** documented in [CLAUDE.md](CLAUDE.md)
- **Write tests** for new functionality
- **Update documentation** as needed
- **Keep commits focused** - one logical change per commit

#### 5. Test Your Changes

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test

# Linting
npm run lint
```

#### 6. Commit Your Changes

Write clear commit messages:
```bash
git commit -m "fix: resolve JWT token expiration issue

- Added token refresh mechanism
- Updated error handling for expired tokens
- Added tests for token refresh flow

Closes #123"
```

Commit message format:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code restructuring
- `test:` test additions or fixes
- `chore:` maintenance tasks

#### 7. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference to related issues
- Screenshots for UI changes
- List of changes made

### Pull Request Guidelines

#### PR Checklist

- [ ] Code follows project patterns (see [CLAUDE.md](CLAUDE.md))
- [ ] Tests pass locally
- [ ] Documentation updated if needed
- [ ] No console.log or debug statements
- [ ] Sensitive data not exposed
- [ ] PR description is clear and complete

#### Review Process

1. **Automated checks** must pass
2. **Code review** by at least one maintainer
3. **Address feedback** promptly
4. **Squash commits** if requested
5. **Maintain patience** - reviews take time

## Development Guidelines

### Code Style

#### Python (Backend)
- Follow PEP 8
- Use type hints for function parameters
- Add docstrings for complex functions
- Keep functions under 50 lines

#### TypeScript (Frontend)
- Use explicit types
- Prefer interfaces over type aliases
- Handle all error cases
- Use meaningful variable names

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Test both happy path and edge cases
- Use meaningful test descriptions

### Documentation

- Update relevant docs with code changes
- Include code examples
- Keep language clear and concise
- Update TODO.md when completing tasks

## Project Structure

See [Project Structure](docs/development/project-structure.md) for details on code organization.

## Common Patterns

Refer to [CLAUDE.md](CLAUDE.md) for:
- API endpoint patterns
- React component patterns
- Database model patterns
- Error handling patterns

## Getting Help

- **Documentation**: Start with [docs/README.md](docs/README.md)
- **Discord**: Join our community chat
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Check existing issues or create new ones

## Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Given credit in commit messages

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to CPAP Analytics! Your efforts help improve sleep therapy for everyone. 💤