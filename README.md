# Unicorn Club — University of Wollongong in Dubai (UOWD)

A Next.js 15 + TypeScript web app scaffold for the Unicorn Club student project at the University of Wollongong in Dubai. This codebase provides pages for authentication, profiles, listings, events, chat, and an admin area. It uses Tailwind CSS, Radix UI components, and modern React patterns.

## Quick overview

- Framework: Next.js 15 (app directory)
- Language: TypeScript + React 19
- Styling: Tailwind CSS
- UI primitives: Radix UI, Lucide icons

# Unicorn Club — University of Wollongong in Dubai (UOWD)

A frontend web application built with Next.js (app router) and TypeScript for the Unicorn Club student community at the University of Wollongong in Dubai. The app provides authentication, listings, events, chat, profiles, and an admin area.

## Table of contents

- Overview
- Tech stack
- Requirements
- Getting started
- Environment
- Scripts
- Project structure
- Development notes
- Testing & linting
- Deployment
- Contributing
- Acknowledgements

## Overview

This repository contains the frontend for a student platform where users can create and browse listings, join events, chat with other members, and manage profiles. The codebase is organized using the Next.js app router and component-driven patterns.

## Tech stack

- Next.js (app router)
- TypeScript + React
- Tailwind CSS for styling
- Radix UI primitives and Lucide icons for base components
- react-hook-form and zod for forms and validation

## Requirements

- Node.js 18 or newer
- pnpm (recommended), or npm / yarn

## Getting started

1. Clone the repository and open the project root.
2. Install dependencies (pnpm recommended):

```powershell
pnpm install
```

If you prefer npm:

```powershell
npm install
```

Start the development server:

```powershell
pnpm dev
```

Open http://localhost:3000 in your browser.

## Environment

Create a `.env.local` file in the project root and add the environment variables required by your setup. Example variables:

```
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-id
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-secret
```

If you add or change variables, consider creating a `.env.example` with non-sensitive placeholders so other developers know what is required.

Check the `lib/` directory for integrations (auth, chat, listings) and update credentials accordingly.

## Scripts

- `pnpm dev` — Run Next.js in development mode
- `pnpm build` — Build production assets
- `pnpm start` — Start the production server after building
- `pnpm lint` — Run ESLint

Example: run the dev server

```powershell
pnpm dev
```

Build and run production locally:

```powershell
pnpm build; pnpm start
```

## Project structure

- `app/` — Next.js routes and page-level components
- `components/` — Reusable components and feature UI
- `components/ui/` — Design-system primitives (buttons, inputs, dialogs)
- `lib/` — Server/client helpers and API clients (auth, listings, events, etc.)
- `hooks/` — Reusable React hooks
- `public/` — Static assets
- `styles/` — Global CSS (Tailwind entry)

Explore these directories to locate route logic, presentational components, and helpers.

## Development notes

- The project uses the Next.js app router with a mix of server and client components.
- UI primitives live in `components/ui/` and are composed into higher-level feature components in `components/`.
- Server-side logic and API helpers are in `lib/`. Look at `lib/auth.ts`, `lib/listings.ts`, and similar files for data-access patterns.
- Tailwind is configured via `postcss.config.mjs` and the Tailwind config file; global styles are in `styles/globals.css`.

## Testing & linting

- ESLint is configured and can be run with:

```powershell
pnpm lint
```

Add unit or integration tests as needed and integrate with your CI pipeline.

## Deployment

The app is compatible with Vercel and other Node.js hosting providers. Typical Vercel flow:

1. Push a branch to GitHub
2. Connect the repository in Vercel
3. Add required environment variables in the Vercel dashboard
4. Vercel will run `pnpm build` and deploy

For self-hosting, run the build and start commands shown in the Scripts section.

## Contributing

- Create a branch from `main` for each feature or fix.
- Run the dev server and ensure pages load before opening a pull request.
- Run linting and fix issues before submitting.

If you change environment variables, add or update a `.env.example` so other contributors know what to set.

## Acknowledgements

Built with Next.js, Tailwind CSS, Radix UI, and other open-source libraries. See `package.json` for the full list of dependencies.

## License

No license file is present. If this project will be shared publicly, add a `LICENSE` to clarify usage terms.
