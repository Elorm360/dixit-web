# Collection photos — drop them here

Each folder is one collection:

```
womenswear/   menswear/   signature/   bespoke/   ready-to-wear/   occasion-wear/
```

**Drop a photo into a folder and it appears on that collection's page on the next deploy.**
No code changes needed.

## Naming

- The filename becomes the piece name and web address:
  `gold-textured-jacket.jpg` → **Gold Textured Jacket** at `/collections/menswear/gold-textured-jacket`
- Use lowercase and hyphens, no spaces.
- **Extra angles of the same piece:** add `--2`, `--3`…
  `gold-textured-jacket--2.jpg`, `gold-textured-jacket--3.jpg`
- Pieces are shown in alphabetical order. To control the order, prefix with numbers:
  `01-gold-textured-jacket.jpg`, `02-black-kaftan.jpg`

## Photo specs

- Portrait (3:4), e.g. **1500 × 2000 px** or larger
- JPG or WebP, under ~1 MB each (the site resizes them automatically)
- Keep the head near the top — thumbnails are cropped from the top down

## Names, descriptions & prices

Optional. Edit `data/pieces.ts`:

```ts
"menswear/gold-textured-jacket.jpg": {
  name: "The Accra Jacket",
  description: "Hand-finished textured jacket with a mandarin collar.",
  details: ["Textured cotton blend", "Made to measure"],
  price: 4500,   // or null for "Price on request"
},
```

Currency is set once in `config/site.ts` (`GHS` or `USD`).

## Without touching code

On github.com, open this folder → **Add file → Upload files** → drag your photos in → **Commit changes**.
Vercel redeploys automatically.
