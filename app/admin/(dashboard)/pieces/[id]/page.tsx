import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, adminButtonOutline } from "@/components/admin/ui";
import { formatPrice } from "@/config/site";
import { requireStaff } from "@/lib/admin";
import { storageUrl } from "@/lib/pieces";
import { deletePiece } from "../actions";
import { DeleteButton } from "../delete-button";
import { PieceForm } from "../piece-form";

export const metadata = { title: "Edit piece" };

export default async function EditPiecePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireStaff();
  const { data: piece } = await supabase.from("pieces").select("*").eq("id", id).maybeSingle();
  if (!piece) notFound();

  return (
    <>
      <Link href="/admin/pieces" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← All pieces</Link>
      <div className="mt-4">
        <PageHeader
          title={piece.name}
          actions={
            <>
              {piece.published && <Link href={`/collections/${piece.collection}/${piece.slug}`} target="_blank" className={adminButtonOutline}>View on site ↗</Link>}
              <DeleteButton action={deletePiece.bind(null, piece.id)} />
            </>
          }
        />
      </div>
      <PieceForm
        storageBase={storageUrl("").replace(/\/$/, "")}
        currencySymbol={formatPrice(0).split(" ")[0]}
        piece={{ ...piece, description: piece.description ?? "", price: piece.price == null ? null : Number(piece.price) }}
      />
    </>
  );
}
