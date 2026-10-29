# BACK2U — Campus Lost & Found

**Lost it? Find it. Get it BACK2U.**

BACK2U is a React + Vite lost-and-found experience. The project includes public lost/found browsing, item reporting, private ownership clues, ownership claims, moderation screens, and a Supabase-ready email sign-in flow.

## Current status

- **UI:** React/Vite front end with responsive layouts and reusable components.
- **Email sign-in:** Supabase magic-link integration is implemented in the front end, but requires your own Supabase project and email settings.
- **Demo mode:** The starter listings and workflow still use browser `localStorage`. Data does not sync between browsers or users.
- **Database:** `supabase/schema.sql` is a starting schema with Row Level Security enabled. The front end's report/claim operations have not yet been migrated to database queries.
- **AI:** Verification-question suggestions are demo/rule-based. No live AI provider is connected.
- **Moderation:** The role switcher is a demo-only presentation tool. Do not use it as production authorization.

Do not use this prototype to store real personal information until database persistence, moderator authorization, private storage, and the full security policies have been reviewed and tested.

## Requirements

- Node.js 18 or newer
- A Supabase project for real email authentication

## Run locally in demo mode

1. Extract the ZIP and open a terminal in `BACK2U-demo`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and keep:

   ```env
   VITE_DEMO_MODE=true
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

Demo mode is for presentations only. It does not prove email ownership, and the role switcher is not secure.

## Configure real email sign-in with Supabase

1. Create a project in [Supabase](https://supabase.com/).
2. In **Project Settings → API**, copy the project URL and the publishable/anon key.
3. Copy `.env.example` to `.env` and set:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   VITE_DEMO_MODE=false
   ```

4. In Supabase **Authentication → URL Configuration**, add your local URL (for example `http://localhost:5173`) and your final deployed URL to the allowed redirect URLs.
5. Configure the Supabase email template and SMTP settings as appropriate for your project. For production, use a trusted SMTP provider rather than relying on default test email limits.
6. Restart Vite after editing `.env`:

   ```bash
   npm run dev
   ```

7. Try signing in with any valid email address you can access, then open the sign-in link from the inbox. Supabase verifies control of the email address; BACK2U does not restrict sign-in to a college domain.

Only the publishable/anon key belongs in a browser app. **Never put a Supabase service-role key, SMTP password, or other secret in a `VITE_` variable.** Vite exposes `VITE_` variables to the client.

The UI checks the college domain for convenience, but a browser-side check is not a security boundary. The included SQL adds a database trigger that enforces the email domain at account creation/update; review it before applying it to an existing project.

## Database starter schema

1. Open your Supabase project’s SQL Editor.
2. Review `supabase/schema.sql` carefully.
3. Apply it to a development project first.
4. Test all policies using separate student and moderator accounts before adding real data.

The schema intentionally does not grant normal users access to `item_private_details`. Add narrowly scoped, server-checked moderator access (for example, secure database functions or a trusted backend) before enabling private-clue review. Do not solve this by adding a broad read policy.

## Before production launch

- Migrate item, claim, notification, and profile reads/writes from `localStorage` to Supabase.
- Add server-enforced roles and moderator-only actions. Never trust a client-side role switcher.
- Add private image storage policies and file type/size validation.
- Add database policies and tests for every read/write operation, including the private clue and claimant answers.
- Add spam/rate limits, audit logs, error monitoring, backups, and a privacy policy.
- Connect a real AI service only through a trusted backend function; do not expose provider API keys in the browser.
- Test sign-in, email delivery, expiry, sign-out, mobile layouts, and cross-account data isolation.

## Main folders

- `src/components/` — homepage, browse, report, details, dashboard, admin, and auth UI
- `src/data/mockData.js` — presentation-only sample records
- `src/lib/supabase.js` — Supabase client and environment configuration
- `supabase/schema.sql` — initial database schema and security policy starter
