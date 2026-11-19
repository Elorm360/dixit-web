# DIXIT

The website for DIXIT, an African luxury menswear house rooted in Accra. The first release is a made-to-order lookbook with manual order requests and a separate bespoke consultation path. It does not offer a cart or take online payments.

## Getting started

Install dependencies and run the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available scripts

- `npm run dev` — start the development server
- `npm run lint` — run ESLint
- `npm run build` — create a production build
- `npm run start` — serve the production build

The black-on-gold DIXIT logo is in `public/brand/dixit-logo.png`. The supplied editorial portrait is in `public/brand/dixit-hero.png` and leads the homepage. The Vercel project is linked; Supabase environment variables are still pending, so enquiries and the admin inbox are not connected yet.

## Supabase enquiries and admin inbox

The public consultation endpoint uses the Supabase project URL and publishable (or legacy anon) key. The private `/admin` inbox uses Supabase Auth and a server-only secret key to read enquiries; access is restricted to verified emails in `ADMIN_EMAILS`.

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the DIXIT project settings. `.env.local` is ignored by Git.
2. Set `SUPABASE_SECRET_KEY` and `ADMIN_EMAILS` on the server. Keep the secret key out of browser variables and source control. The allowlist must contain the exact email of a confirmed Supabase Auth user.
3. In the Supabase SQL Editor for the DIXIT project, run [`supabase/migrations/20261106160000_create_consultation_requests.sql`](./supabase/migrations/20261106160000_create_consultation_requests.sql).
4. Create or invite the admin user in Supabase Auth, confirm its email, then sign in at `/admin`. The inbox displays the latest 100 consultation and made-to-order requests and provides direct email/phone follow-up.

The migration enables row-level security and allows anonymous visitors to insert validated enquiries only; it does not grant public reads or updates. The admin API verifies the user's access token with Supabase Auth and checks `ADMIN_EMAILS` before using the server-only secret key. Made-to-order requests are not confirmed sales or paid orders. The first admin release is an enquiry inbox, not product editing, inventory, or payment management.

## Deploy to Vercel

Keep the detected Next.js framework and default build settings (`npm run build`). Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `ADMIN_EMAILS` to the Vercel environments that should accept requests and allow admin access. The secret key must be server-only. Apply the migration above to the same Supabase project and submit a test enquiry after deployment. Without the public Supabase settings, the site can render but the enquiry endpoint returns `503`; `/admin` displays a setup or connection message until all required settings and the migration are in place.

The current order flow is a request for the team to confirm manually; no payment gateway or online checkout is configured. Product details, delivery/returns terms, email notifications, abuse/rate limiting, and the final privacy notice still need to be completed before public launch.
