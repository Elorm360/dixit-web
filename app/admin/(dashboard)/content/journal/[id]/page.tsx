import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, adminButtonOutline } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin";
import { sitePhotoUrl } from "@/lib/content";
import { DeleteButton } from "../../../pieces/delete-button";
import { deletePost } from "../../actions";
import { PostEditor } from "../post-editor";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireStaff();
  const { data: post } = await supabase.from("journal_posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();

  return (
    <>
      <Link href="/admin/content/journal" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← Journal</Link>
      <div className="mt-4">
        <PageHeader
          title={post.title}
          actions={
            <>
              {post.published && <Link href={`/journal/${post.slug}`} target="_blank" className={adminButtonOutline}>View on site ↗</Link>}
              <DeleteButton action={deletePost.bind(null, post.id)} confirmText="Delete this post and its cover photo? This can’t be undone." />
            </>
          }
        />
      </div>
      <PostEditor storageBase={sitePhotoUrl("").replace(/\/$/, "")} post={{ ...post, image: post.image ?? "" }} />
    </>
  );
}
