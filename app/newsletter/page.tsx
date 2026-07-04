import { NewsletterList } from "@/components/newsletter/newsletter-list";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NewsletterRow } from "@/types/newsletter";

export const metadata = {
  title: "Newsletter",
};

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <NewsletterList newsletters={(data ?? []) as NewsletterRow[]} />;
}
