import Link from "next/link";
import { PageHeader, Panel } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin";
import { ENQUIRY_STATUSES, statusMeta } from "@/lib/enquiry-status";

export const metadata = { title: "Getting started" };

const firstSteps = [
  { title: "Change your password", body: "Replace the temporary password you were given with your own.", href: "/admin/account", cta: "My account" },
  { title: "Add your business details", body: "Enter the WhatsApp number, email, Instagram and opening hours. The WhatsApp button appears across the site as soon as the number is saved.", href: "/admin/content#business", cta: "Website content" },
  { title: "Look around the website", body: "Open the site and browse it as a client would — home, collections, bespoke, contact.", href: "/", cta: "View site ↗", external: true },
  { title: "Upload your first collection", body: "Drop in a batch of photos. Each becomes a hidden draft piece you can name, price and publish.", href: "/admin/pieces/bulk", cta: "Bulk upload" },
  { title: "Publish and feature pieces", body: "On Pieces, switch drafts to Live, drag them into order, and star (★) the ones to show on the home page.", href: "/admin/pieces", cta: "Pieces" },
  { title: "Check enquiries", body: "Every consultation request from the website lands here. Reply by WhatsApp, email or phone in one tap.", href: "/admin/enquiries", cta: "Enquiries" },
];

export default async function GuidePage() {
  const { role } = await requireStaff();

  return (
    <>
      <PageHeader eyebrow="Welcome to the DIXIT studio" title="Getting started" />

      <p className="mb-10 max-w-3xl text-base leading-8 text-kd-gray">
        This dashboard runs the DIXIT website. What you change here — photos, prices, which pieces are live — appears on the site within a few seconds, with no developer needed.
      </p>

      <h2 className="font-display mb-4 text-3xl">Your first steps</h2>
      <ol className="mb-12 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {firstSteps.map((s, i) => (
          <li key={s.title}>
            <Panel className="flex h-full flex-col p-6">
              <span className="font-display text-4xl text-kd-gold-dark">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-kd-gray">{s.body}</p>
              <Link href={s.href} target={s.external ? "_blank" : undefined} className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-kd-gold-dark hover:text-kd-black">{s.cta} →</Link>
            </Panel>
          </li>
        ))}
      </ol>

      <div className="grid gap-8 xl:grid-cols-2">
        <Panel className="p-6 md:p-8">
          <h2 className="font-display text-2xl">Photos that look their best</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-kd-gray">
            <li><strong className="text-kd-black">Portrait shape (3:4)</strong>, at least 1500 × 2000 pixels. JPG or WebP, up to 10 MB each.</li>
            <li>Keep the head near the top — thumbnails are cropped from the top down.</li>
            <li>The <strong className="text-kd-black">filename becomes the piece name</strong>: <code>gold-textured-jacket.jpg</code> → “Gold Textured Jacket”. You can rename before uploading.</li>
            <li>Extra angles of the same piece: <code>gold-textured-jacket--2.jpg</code>, <code>--3.jpg</code>… They show on that piece’s page.</li>
            <li>The first photo of a piece is its cover. Reorder photos when editing a piece.</li>
            <li>Leave the price empty to show “Price on request”.</li>
          </ul>
        </Panel>

        <Panel className="p-6 md:p-8">
          <h2 className="font-display text-2xl">Working with enquiries</h2>
          <p className="mt-4 text-sm leading-6 text-kd-gray">Move each enquiry through these stages so the whole team can see where every client stands:</p>
          <ol className="mt-4 space-y-2 text-sm">
            {ENQUIRY_STATUSES.map((s) => (
              <li key={s.value} className="flex items-center gap-3">
                <span className={`inline-flex min-w-36 justify-center rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] ${statusMeta(s.value).tone}`}>{s.label}</span>
                <span className="text-kd-gray">
                  {{
                    new: "Just arrived — reply as soon as you can.",
                    contacted: "You’ve reached out to the client.",
                    scheduled: "A consultation date is agreed.",
                    in_progress: "The piece is being made.",
                    completed: "Delivered. Thank the client!",
                    archived: "Not going ahead, or spam.",
                  }[s.value]}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm leading-6 text-kd-gray">Private notes on an enquiry are only visible to the team. Export everything to a spreadsheet from the Overview.</p>
        </Panel>

        {role === "super_admin" && (
          <Panel className="p-6 md:p-8">
            <h2 className="font-display text-2xl">As a super admin</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-kd-gray">
              <li>You decide who can use this dashboard on the <Link href="/admin/team" className="text-kd-black underline">Team</Link> page.</li>
              <li><strong className="text-kd-black">Staff</strong> work on enquiries and pieces. <strong className="text-kd-black">Super admins</strong> can also add and remove people.</li>
              <li>Remove access as soon as someone leaves the team.</li>
            </ul>
          </Panel>
        )}

        <Panel className="p-6 md:p-8">
          <h2 className="font-display text-2xl">Good habits</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-kd-gray">
            <li>Never share your password — each person should have their own login.</li>
            <li>Sign out on shared computers.</li>
            <li>Check “New” enquiries daily; a quick reply wins clients.</li>
            <li>Something not right on the site? Note the page and what you saw, and send it to your web team.</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
