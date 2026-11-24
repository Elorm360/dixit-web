import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff, toDateTimeLocal } from "@/lib/admin";
import { sitePhotoUrl } from "@/lib/content";
import { PostEditor } from "../post-editor";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireStaff();
  return (
    <>
      <Link href="/admin/content/journal" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← Journal</Link>
      <div className="mt-4"><PageHeader title="New post" /></div>
      <PostEditor
        storageBase={sitePhotoUrl("").replace(/\/$/, "")}
        post={{ id: null, title: "", slug: "", excerpt: "", body: "", image: "", published_on: toDateTimeLocal(new Date().toISOString()).slice(0, 10), published: false }}
      />
    </>
  );
}
