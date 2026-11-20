# DIXIT consultation form setup

The consultation form posts directly to Supabase PostgREST using the project's publishable key. No service-role or secret key is used in browser code.

## Environment

Copy `.env.example` to `.env.local` for local development and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Use the publishable key from Supabase Project Settings → API Keys. Never put a service-role or secret key in a `NEXT_PUBLIC_*` variable.

## Database

The connected DIXIT Supabase project already has the service constraint and anonymous insert-only policy in place. The applied migration history includes `20261119235602_dixit_consultation_services_and_public_insert` and `20261119235620_dixit_consultation_public_insert`. The matching SQL is versioned at `supabase/migrations/20261119235620_dixit_consultation_public_insert.sql`.

The database default supplies `status = 'new'`, and the insert policy enforces it. Anonymous visitors can insert only the customer fields used by the form. They cannot read, update, or delete enquiries. Existing staff read/update policies are unchanged.

## Local verification

1. Run `npm ci` and copy `.env.example` to `.env.local`.
2. Set the real project publishable key in `.env.local`.
3. Run `npm run dev` and open `/consultation`.
4. Submit a test enquiry and verify the row appears in Supabase Table Editor.
5. Confirm anonymous access cannot select, update, or delete consultation requests.

A honeypot field is included as a basic spam deterrent. Add CAPTCHA/Turnstile and server-side rate limiting before high-volume public launch.
