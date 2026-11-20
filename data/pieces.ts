/**
 * Piece details and pricing.
 *
 * Photos are picked up automatically from public/collections/<collection>/.
 * A photo with no entry here still appears, named from its filename and
 * marked "Price on request".
 *
 * To name and price a piece, add an entry keyed by "<collection>/<filename>":
 *
 *   "menswear/gold-textured-jacket.jpg": {
 *     name: "Gold Textured Jacket",
 *     description: "Hand-finished textured jacket with a mandarin collar.",
 *     details: ["Textured cotton blend", "Made to measure available"],
 *     price: 4500,       // number in the currency set in config/site.ts, or null
 *   },
 *
 * Extra photos of the same piece: name them with a "--2", "--3" suffix,
 * e.g. gold-textured-jacket--2.jpg. They show on the piece's page.
 */
export type PieceInfo = {
  name?: string;
  description?: string;
  details?: string[];
  price?: number | null;
};

export const pieces: Record<string, PieceInfo> = {
  // "menswear/gold-textured-jacket.jpg": { name: "Gold Textured Jacket", price: null },
};
