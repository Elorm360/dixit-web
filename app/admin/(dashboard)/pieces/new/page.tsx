import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { formatPrice } from "@/config/site";
import { requireStaff } from "@/lib/admin";
import { storageUrl } from "@/lib/pieces";
import { PieceForm } from "../piece-form";

export const metadata = { title: "New piece" };

export default async function NewPiecePage({ searchParams }: { searchParams: Promise<{ collection?: string }> }) {
  await requireStaff();
  const { collection = "womenswear" } = await searchParams;
  return (
    <>
      <Link href="/admin/pieces" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← All pieces</Link>
      <div className="mt-4"><PageHeader title="New piece" /></div>
      <PieceForm
        storageBase={storageUrl("").replace(/\/$/, "")}
        currencySymbol={formatPrice(0).split(" ")[0]}
        piece={{ id: null, collection, name: "", slug: "", description: "", details: [], price: null, images: [], published: true, sort_order: 0 }}
      />
    </>
  );
}
