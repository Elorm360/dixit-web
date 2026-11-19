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

The supplied black-on-gold DIXIT logo is in `public/brand/dixit-logo.png` and is used in the header and as the browser icon. The supplied editorial portrait is in `public/brand/dixit-hero.png` and leads the homepage. The Vercel project is linked; Supabase environment variables are still pending, so enquiries are not saved yet.

## Supabase enquiries

The consultation endpoint uses the Supabase project URL and publishable (or legacy anon) key on the server. It never uses a service-role key.

1. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the DIXIT project settings. `.env.local` is ignored by Git.
2. In the Supabase SQL Editor for the DIXIT project, run [`supabase/migrations/20261106160000_create_consultation_requests.sql`](./supabase/migrations/20261106160000_create_consultation_requests.sql).
3. Restart the development server and submit a test enquiry. Confirm it appears in the `consultation_requests` table.

The migration enables row-level security and allows anonymous visitors to insert validated enquiries only; it does not grant public reads or updates. Made-to-order requests use this enquiry flow; they are not confirmed sales or paid orders. Email notifications, automated abuse/rate limiting, product details, delivery/returns terms, and the final privacy notice should be completed before public launch. No real product stock, prices, contact details, or payment options have been invented in the lookbook.

## Deploy to Vercel

Import this repository into Vercel and keep the detected Next.js framework and default build settings (`npm run build`). Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as Vercel project environment variables for every environment where enquiries should be accepted. Use the publishable (or legacy anon) key only; never add a service-role or secret key. Apply the migration above to the same Supabase project and submit a test enquiry after deployment. Without these settings, the site can render but the enquiry endpoint returns `503`. The current order flow is a request for the team to confirm manually; no payment gateway or online checkout is configured.

Before announcing the site, replace the draft privacy notice with DIXIT's approved policy and real privacy contact/retention details. Email notifications and abuse/rate limiting are not configured in this release.
