import Link from "next/link";
import { PageHeader, Panel, adminButtonPrimary } from "@/components/admin/ui";
import { formatDate, requireStaff } from "@/lib/admin";

export const metadata = { title: "Journal" };

type Row = { id: string; title: string; slug: string; published: boolean; published_on: string };

export default async function JournalAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const { supabase } = await requireStaff();
  const { saved, deleted } = await searchParams;
  const { data, error } = await supabase.from("journal_posts").select("id, title, slug, published, published_on").order("published_on", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <>
      <Link href="/admin/content" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← Website content</Link>
      <div className="mt-4">
        <PageHeader eyebrow={`${rows.filter((r) => r.published).length} published`} title="Journal" actions={<Link href="/admin/content/journal/new" className={adminButtonPrimary}>+ New post</Link>} />
      </div>
      {error && <p className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">The journal isn’t set up in the database yet.</p>}
      {(saved || deleted) && <p className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">{saved ? "Post saved." : "Post deleted."}</p>}

      <Panel>
        {rows.length ? (
          <ul className="divide-y divide-kd-black/10">
            {rows.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-6 py-4">
                <Link href={`/admin/content/journal/${p.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium hover:underline">{p.title}</p>
                  <p className="text-xs text-kd-gray">{formatDate(p.published_on)} · /journal/{p.slug}</p>
                </Link>
                <span className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${p.published ? "bg-emerald-100 text-emerald-900" : "bg-neutral-200 text-neutral-700"}`}>{p.published ? "Live" : "Draft"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-10 text-sm text-kd-gray">No posts yet. The Journal stays out of the site menu until the first post is published.</p>
        )}
      </Panel>
    </>
  );
}
