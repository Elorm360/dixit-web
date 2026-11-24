import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { collectionCategories } from "@/data/collections";
import { requireStaff } from "@/lib/admin";
import { BulkUploader } from "./bulk-uploader";

export const metadata = { title: "Bulk upload" };

export default async function BulkUploadPage({ searchParams }: { searchParams: Promise<{ collection?: string }> }) {
  await requireStaff();
  const { collection } = await searchParams;
  const initial = collectionCategories.some((c) => c.slug === collection) ? collection! : collectionCategories[0].slug;

  return (
    <>
      <Link href="/admin/pieces" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← All pieces</Link>
      <div className="mt-4">
        <PageHeader eyebrow="Collections manager" title="Bulk upload" />
      </div>
      <BulkUploader initialCollection={initial} />
    </>
  );
}
