# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

After making any code changes, always run a full build/type check (`yarn build` or equivalent) before committing to catch errors like missing imports, unused variables, or missing build steps.

## Commands

```bash
yarn dev        # Start dev server (Vite HMR)
yarn build      # Type-check with tsc, then bundle with Vite
yarn lint       # Run ESLint
yarn preview    # Preview the production build locally
```

No test runner is configured yet.

## Stack

- **React 19** with TypeScript, bundled by **Vite 7**
- Package manager: **yarn** (see `yarn.lock`)
- Strict TypeScript: `strict`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` are all enabled in `tsconfig.app.json`
- ESLint config (`eslint.config.js`) enforces `react-hooks` and `react-refresh` rules

## Language & Conventions

This project uses TypeScript. Always ensure type safety, check for unused imports, and run `npx tsc --noEmit` when verifying changes.

## Git Workflow

When committing and pushing, use descriptive commit messages in English summarizing what changed and why. Always verify the build passes before pushing.

## Project Status

This is a fresh scaffold — only `src/main.tsx` (entry point) and `src/App.tsx` (renders "Hello World") exist. The Google Keep clone feature work is yet to begin.
