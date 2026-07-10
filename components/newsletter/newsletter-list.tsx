"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { NewsletterPreviewModal } from "@/components/newsletter/newsletter-preview-modal";
import { Button } from "@/components/ui";
import {
  formatPublishAt,
  getNewsletterScheduleStatus,
  getNewsletterTitle,
  NEWSLETTER_SCHEDULE_LABELS,
  NEWSLETTER_STATUS_LABELS,
} from "@/lib/newsletter/display";
import { formatDate } from "@/lib/utils";
import type { NewsletterRow } from "@/types/newsletter";

type NewsletterListProps = {
  newsletters: NewsletterRow[];
};

export function NewsletterList({ newsletters }: NewsletterListProps) {
  const router = useRouter();
  const [previewRow, setPreviewRow] = useState<NewsletterRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const response = await fetch(`/api/newsletters/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!response.ok) {
      alert("Failed to delete newsletter");
      return;
    }

    router.refresh();
  }

  async function handlePublishToggle(row: NewsletterRow) {
    const endpoint =
      row.status === "published"
        ? `/api/newsletters/${row.id}/unpublish`
        : `/api/newsletters/${row.id}/publish`;

    setTogglingId(row.id);
    const response = await fetch(endpoint, { method: "POST" });
    setTogglingId(null);

    if (!response.ok) {
      alert(
        row.status === "published"
          ? "Failed to unpublish newsletter"
          : "Failed to publish newsletter"
      );
      return;
    }

    router.refresh();
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Newsletter</h1>
          <p className="mt-1 text-sm text-slate-500">
            {newsletters.length} saved · publish to make public · schedule a
            date for future auto-send
          </p>
        </div>
        <Link href="/newsletter/new">
          <Button>
            <Plus className="h-4 w-4" />
            New newsletter
          </Button>
        </Link>
      </div>

      {newsletters.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500">No newsletters yet.</p>
          <Link href="/newsletter/new" className="mt-4 inline-block">
            <Button variant="secondary">Create your first newsletter</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Issue</th>
                <th className="px-4 py-3 font-medium">Publish date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newsletters.map((row) => {
                const title = getNewsletterTitle(row.state, row.issue_num);
                const status = row.status ?? "draft";
                const statusMeta = NEWSLETTER_STATUS_LABELS[status];
                const schedule = getNewsletterScheduleStatus(row.publish_at);
                const scheduleMeta =
                  schedule === "none"
                    ? null
                    : NEWSLETTER_SCHEDULE_LABELS[schedule];

                return (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{title}</div>
                      <div className="text-xs text-slate-400">
                        {row.state.issueDate}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatPublishAt(row.publish_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                      {scheduleMeta && (
                        <span
                          className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${scheduleMeta.className}`}
                        >
                          {scheduleMeta.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(row.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/newsletter/${row.id}/edit`}
                          className="text-brand-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPreviewRow(row)}
                          className="text-slate-600 hover:underline"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => void handlePublishToggle(row)}
                          disabled={togglingId === row.id}
                          className="text-slate-600 hover:underline disabled:opacity-50"
                        >
                          {row.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(row.id, title)}
                          disabled={deletingId === row.id}
                          className="inline-flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NewsletterPreviewModal
        newsletter={previewRow}
        onClose={() => setPreviewRow(null)}
      />
    </AdminShell>
  );
}
