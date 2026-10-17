# P3 — Real Estate Mini App

A web-based real-estate mini application built with React, TypeScript, Vite, React Router, and Supabase.

## Project status

The repository includes authentication/session handling, profile-based roles, protected routes, property-related data features, and Supabase database migrations with row-level security (RLS).

**Important:** A successful deployment does not, by itself, prove that every authentication, authorization, database-policy, or end-to-end check has passed. Review the latest GitHub Actions results before treating a release as production-ready.

## Live deployment

- **Application:** https://brightsidepublication-stack.github.io/P3/
- **Repository:** https://github.com/brightsidepublication-stack/P3
- **GitHub Actions:** https://github.com/brightsidepublication-stack/P3/actions

## Technology stack

- React 18
- TypeScript
- Vite
- React Router
- Supabase JavaScript client
- Zod
- Tailwind CSS
- Lucide React icons

## Requirements

Install a current Node.js release compatible with the repository workflows (Node.js 22 is used in CI) and npm.

## Run locally

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/brightsidepublication-stack/P3.git
   cd P3
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the required Vite environment variables in a local `.env.local` file:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

   Replace the placeholders with values from your own Supabase project. Do not commit real credentials. Only use a Supabase **publishable/anon key** in browser-side variables; never put a service-role key or other privileged secret in `VITE_*` variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

Vite prints the local URL in the terminal.

## Validation commands

Run these before submitting changes:

```bash
npm run typecheck
npm run build
npm run preview
```

- `npm run typecheck` checks TypeScript types.
- `npm run build` runs the TypeScript project build and creates the production bundle.
- `npm run preview` serves the built bundle locally for a production-build smoke test.

The repository also contains a Phase 3 verification workflow under `.github/workflows/`. Check the Actions tab for the actual result of the latest run; do not infer test success from deployment status alone.

## Supabase and database

Database migrations are stored in `supabase/migrations/`. Apply and test migrations only against the intended development or dedicated test Supabase project, after reviewing each migration and backing up relevant data.

The project uses role-aware access checks in the frontend and RLS policies in the database. Frontend route guards are not a substitute for database authorization: verify access with authenticated test accounts for each supported role and confirm that RLS prevents cross-user access.

For CI workflows, configure the required Supabase URL and anon/publishable key as repository Actions secrets. Do not store passwords, service-role keys, or other privileged credentials in source control.

## Security notes

- Keep privileged Supabase keys out of the browser bundle and repository.
- Enforce authorization in Supabase RLS policies as well as in the UI.
- Test role boundaries with separate accounts and representative records.
- Use a dedicated test project for destructive or policy-verification tests.
- Never claim security or release readiness solely because the app builds or deploys.

## Suggested workflow for contributions

1. Create a focused branch for the change.
2. Keep changes scoped and avoid unrelated edits to migrations or access controls.
3. Run type checking and the production build.
4. Test sign-in/sign-out, session restoration, redirects, role restrictions, and data access against the intended test environment.
5. Open a pull request and review the GitHub Actions checks before merging.

## License

No license terms are specified in this README. Unless a license is added to the repository, do not assume that reuse, redistribution, or modification is granted.

## Listing workflow (Phase 7)

The current application includes the initial listing lifecycle:

1. Register the property's base information under **املاک من**.
2. Create a listing linked to one of the user's properties. New listings are stored as hidden drafts.
3. Review drafts under **آگهی‌های من**; drafts and rejected listings can be edited and resubmitted.
4. An administrator or super administrator can review pending listings, publish eligible listings, or reject them with a reason from **بررسی آگهی‌ها**.
5. Published/public listings appear on the public **آگهی‌های املاک** page (`/browse`) and have a public details page.
6. Database row-level security and validation triggers remain authoritative. A successful client-side action is not a substitute for the database's permission and integrity checks.

The listing form currently creates standard listings. Short-term listings have additional database requirements and are deliberately not editable through the standard-listing form until their dedicated details form is implemented. The moderation page warns that short-term listings require their matching detail record before publication.

Before release, validate the complete flow with separate ordinary-user and admin accounts in the intended Supabase project: create a property, create a draft listing, edit it, submit it, publish/reject it as admin, and verify that only published/public listings are visible to unauthenticated users. Never use a service-role key in the frontend.

