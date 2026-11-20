# DIXIT — website

Next.js site for DIXIT, a fashion house in Accra.

```bash
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Where to update things

| What | Where |
|---|---|
| WhatsApp, email, phone, Instagram, address, hours | `config/site.ts` → `contact` |
| Currency, bespoke "from" price, bespoke timing | `config/site.ts` → `pricing` |
| Collection photos | drop into `public/collections/<collection>/` (see `public/collections/README.md`) |
| Piece names, descriptions, prices | `data/pieces.ts` |
| Founder story and photo | `data/founder.ts` (+ photo in `public/founder/`) |
| Journal posts | `data/journal.ts` |
| Home page photo | replace `public/brand/dixit-hero.jpg` (portrait, 1600 × 2400 px or larger) |

Anything left empty stays hidden on the site — no broken links or blank sections.

## Enquiries

The consultation form posts to `/api/enquiry`, which:

1. **Emails** the enquiry to `ENQUIRY_EMAIL_TO` via [Resend](https://resend.com) (reply goes straight to the client), and
2. **Saves** it to Supabase if `NEXT_PUBLIC_SUPABASE_*` is set (optional).

After sending, the client gets a **"Continue on WhatsApp"** button with their details pre-filled, and a floating WhatsApp button appears on every page once `contact.whatsapp` is set.

### Resend setup
1. Create a free account at resend.com → **API Keys** → create a key.
2. In Vercel → Project → **Settings → Environment Variables**, add `RESEND_API_KEY` and `ENQUIRY_EMAIL_TO`, then redeploy.
3. Until you verify your own domain in Resend, the default sender `onboarding@resend.dev` can only deliver to the email address you signed up to Resend with. After verifying a domain, set `ENQUIRY_EMAIL_FROM` (e.g. `DIXIT <enquiries@yourdomain.com>`).

## Studio dashboard (`/admin`)

Staff sign in at **/admin** to:

- **Enquiries** — see every consultation request, filter/search, set a status (New → Contacted → Consultation booked → In progress → Completed / Closed), keep private notes, and reply in one tap by WhatsApp, email or phone. Export to CSV.
- **Pieces** — upload photos, set names, descriptions and prices, reorder, publish/hide and delete. Changes appear on the website within seconds, no deploy needed. (Pieces in the photo folders still work and are listed read-only.)
- **Overview** — new enquiries, this week's count, active clients and upcoming consultation dates.

### Setup (once)
1. Apply the migrations in `supabase/migrations/` to the Supabase project (`npx supabase link` then `npx supabase db push`, or paste each file into the SQL editor in order).
2. In Supabase → **Authentication → Users**, add a user (email + password) for each staff member.
3. Grant them dashboard access in the SQL editor:
   ```sql
   insert into public.staff (user_id, name)
   select id, 'Their Name' from auth.users where email = 'person@example.com';
   ```
4. Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in Vercel.

Security: database row-level security only lets staff read or change enquiries and pieces; the public can only submit enquiries and view published pieces. Signing in with a non-staff account is refused.

### Local development
`npx supabase start` runs a local Supabase with all migrations (needs Docker). Put its URL and publishable key in `.env.local`.
