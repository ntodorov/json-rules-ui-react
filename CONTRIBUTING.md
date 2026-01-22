# Contributing to JSON Rules Engine UI

First off, thank you for considering contributing to JSON Rules Engine UI! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to a welcoming and inclusive environment. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/ntodorov/json-rules-ui-react.git
   cd json-rules-ui-react
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ntodorov/json-rules-ui-react.git
   ```

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-rule-templates` — New features
- `fix/condition-validation` — Bug fixes
- `docs/update-readme` — Documentation updates
- `refactor/condition-builder` — Code refactoring

### Commit Messages

Write clear, concise commit messages:

```
feat: add rule template library

- Add 5 pre-built rule templates
- Create template selector component
- Add template preview functionality
```

Prefix your commits:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

## Pull Request Process

1. **Update your fork** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit them

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** from your fork to the main repository

### PR Checklist

- [ ] Code follows the project's style guide
- [ ] Self-reviewed the code
- [ ] Added/updated comments where necessary
- [ ] No new warnings or errors
- [ ] Updated documentation if needed
- [ ] PR has a clear title and description

## Style Guide

### TypeScript

- Use TypeScript strict mode
- Define interfaces for component props
- Avoid `any` — use proper types
- Use meaningful variable names

### React

- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow the container/presenter pattern where appropriate

### CSS/Tailwind

- Use Tailwind utility classes
- Follow the existing color scheme via CSS variables
- Ensure dark mode compatibility
- Keep responsive design in mind

### File Structure

```
src/
├── components/
│   └── feature/
│       ├── FeatureComponent.tsx
│       ├── FeatureSubComponent.tsx
│       └── index.ts          # Barrel export
├── hooks/
│   └── useFeature.ts
├── lib/
│   └── featureUtils.ts
└── store/
    └── featureStore.ts
```

## Reporting Bugs

### Before Reporting

1. Search existing issues to avoid duplicates
2. Try the latest version
3. Reproduce in a clean environment

### Bug Report Template

```markdown
## Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]

## Screenshots
If applicable, add screenshots.
```

## Suggesting Features

We love new ideas! When suggesting a feature:

1. **Check existing issues** — it might already be planned
2. **Be specific** — describe the use case
3. **Consider implementation** — how might it work?

### Feature Request Template

```markdown
## Problem
What problem does this solve?

## Proposed Solution
How would this feature work?

## Alternatives Considered
Any other approaches you've thought of?

## Additional Context
Mockups, examples, or references.
```

---

## Questions?

Feel free to open an issue or reach out. We're happy to help!

Thank you for contributing! 🎉
