import { AdminShell } from "@/components/admin-shell";
import { NewsletterBuilder } from "@/components/newsletter/newsletter-builder";

export const metadata = {
  title: "Newsletter",
};

export default function NewsletterPage() {
  return (
    <AdminShell fullWidth>
      <NewsletterBuilder />
    </AdminShell>
  );
}
