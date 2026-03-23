# Contributing

## Getting Started

```bash
git clone https://github.com/a-lagutov/export-prod.git
cd export-prod
npm install
npm run prepare   # install Husky pre-commit hook
npm run watch     # start dev build
```

## Workflow

1. Fork the repo and create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` and `npm run build` — both must pass
4. Open a pull request against `main`

## Code Style

- All functions must have JSDoc comments
- Variable names must be readable and descriptive (no `cb`, `fn`, `tmp`, etc.)
- Functions/variables: `camelCase` · Components: `PascalCase` · Constants: `UPPER_SNAKE_CASE`
- Commit messages must be in English

A Husky pre-commit hook runs ESLint + Prettier automatically. Fix any issues before pushing.

## Reporting Bugs

Open a GitHub issue using the **Bug report** template.

## Suggesting Features

Open a GitHub issue using the **Feature request** template.
