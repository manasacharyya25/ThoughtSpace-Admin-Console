import { notFound } from "next/navigation";
import { NewsletterBuilder } from "@/components/newsletter/newsletter-builder";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NewsletterRow } from "@/types/newsletter";

export const metadata = {
  title: "Edit newsletter",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsletterPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  return (
    <NewsletterBuilder
      mode="edit"
      siteUrl={env.siteUrl()}
      initialRow={data as NewsletterRow}
    />
  );
}
