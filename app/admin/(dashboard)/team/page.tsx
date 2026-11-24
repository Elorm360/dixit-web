import { PageHeader, Panel } from "@/components/admin/ui";
import { formatDate, requireSuperAdmin, roleLabels, type StaffRole } from "@/lib/admin";
import { AddMemberForm } from "./add-member-form";
import { changeRole, removeTeamMember } from "./actions";

export const metadata = { title: "Team" };

type Member = { user_id: string; email: string; role: StaffRole; added_at: string; last_sign_in_at: string | null };

const SUPABASE_USERS_URL = "https://supabase.com/dashboard/project/jomykqytajmytehjdslg/auth/users";

export default async function TeamPage() {
  const { supabase, userId } = await requireSuperAdmin();
  const { data, error } = await supabase.rpc("list_staff");
  const members = (data ?? []) as Member[];

  return (
    <>
      <PageHeader eyebrow="Super admin" title="Team" />

      {error && (
        <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          Could not load the team. If the database was just updated, apply the latest migration and refresh.
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="border-b border-kd-black/10 px-6 py-4">
            <h2 className="font-display text-2xl">People with access</h2>
            <p className="mt-1 text-xs text-kd-gray">Super admins can do everything, including managing this team. Staff can work on enquiries and pieces.</p>
          </div>
          <ul className="divide-y divide-kd-black/10">
            {members.map((m) => {
              const isMe = m.user_id === userId;
              return (
                <li key={m.user_id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{m.email}{isMe && <span className="ml-2 text-xs font-normal text-kd-gray">(you)</span>}</p>
                    <p className="text-xs text-kd-gray">
                      Added {formatDate(m.added_at)} · {m.last_sign_in_at ? `last signed in ${formatDate(m.last_sign_in_at)}` : "hasn’t signed in yet"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${m.role === "super_admin" ? "bg-kd-warm-gold text-kd-black" : "bg-neutral-200 text-neutral-700"}`}>{roleLabels[m.role]}</span>
                  {!isMe && (
                    <div className="flex gap-3 text-xs">
                      <form action={changeRole.bind(null, m.email, m.role === "super_admin" ? "staff" : "super_admin")}>
                        <button className="underline-offset-2 hover:underline">{m.role === "super_admin" ? "Make staff" : "Make super admin"}</button>
                      </form>
                      <form action={removeTeamMember.bind(null, m.user_id)}>
                        <button className="text-red-700 underline-offset-2 hover:underline">Remove access</button>
                      </form>
                    </div>
                  )}
                </li>
              );
            })}
            {members.length === 0 && !error && <li className="px-6 py-6 text-sm text-kd-gray">No team members found.</li>}
          </ul>
        </Panel>

        <div className="space-y-8">
          <Panel className="p-6">
            <h2 className="font-display text-2xl">Add someone</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-kd-gray">
              <li>
                Create their login in{" "}
                <a href={SUPABASE_USERS_URL} target="_blank" rel="noreferrer" className="text-kd-black underline">Supabase → Authentication → Users</a>
                : <em>Add user → Create new user</em>, enter their email and a temporary password, tick <em>Auto confirm</em>.
              </li>
              <li>Give them access below.</li>
              <li>Send them the temporary password privately (not by email). They sign in at <strong>/admin</strong> and change it under <em>My account</em>.</li>
            </ol>
            <div className="mt-6">
              <AddMemberForm />
            </div>
          </Panel>
          <Panel className="p-6 text-sm leading-6 text-kd-gray">
            <h2 className="font-display text-xl text-kd-black">Removing access</h2>
            <p className="mt-2">“Remove access” stops someone using the dashboard straight away. Their login still exists in Supabase; delete it there if they should not sign in at all.</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
