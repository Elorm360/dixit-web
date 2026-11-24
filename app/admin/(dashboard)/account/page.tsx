import { PageHeader, Panel } from "@/components/admin/ui";
import { requireStaff, roleLabels } from "@/lib/admin";
import { PasswordForm } from "./password-form";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const { email, role } = await requireStaff();

  return (
    <>
      <PageHeader eyebrow="Your login" title="My account" />
      <div className="grid gap-8 xl:grid-cols-[1fr_1.4fr]">
        <Panel className="h-fit p-6">
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="kd-label">Email</dt>
              <dd className="font-medium">{email}</dd>
            </div>
            <div>
              <dt className="kd-label">Role</dt>
              <dd className="font-medium">{roleLabels[role]}</dd>
              <dd className="mt-1 text-xs text-kd-gray">
                {role === "super_admin" ? "You can manage everything, including who has access (Team)." : "You can work on enquiries and pieces. A super admin manages access."}
              </dd>
            </div>
          </dl>
        </Panel>
        <Panel className="p-6">
          <h2 className="font-display mb-6 text-2xl">Change password</h2>
          <PasswordForm />
        </Panel>
      </div>
    </>
  );
}
