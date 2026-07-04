import { NewsletterBuilder } from "@/components/newsletter/newsletter-builder";
import { env } from "@/lib/env";

export const metadata = {
  title: "New newsletter",
};

export default function NewNewsletterPage() {
  return <NewsletterBuilder mode="create" siteUrl={env.siteUrl()} />;
}
