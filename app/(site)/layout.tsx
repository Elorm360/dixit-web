import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getJournalPosts, getNavigation, getSiteContent } from "@/lib/content";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ contact }, posts] = await Promise.all([getSiteContent(), getJournalPosts()]);
  const navigation = getNavigation(posts.length > 0);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <SiteHeader navigation={navigation} />
        <div className="flex-1">{children}</div>
        <SiteFooter navigation={navigation} contact={contact} />
      </div>
      <WhatsAppButton number={contact.whatsapp} />
    </>
  );
}
