import type {
  NewsletterPublishStatus,
  NewsletterScheduleStatus,
  NewsletterState,
} from "@/types/newsletter";

export function getNewsletterTitle(state: NewsletterState): string {
  const headline = state.heroHeadlineBlack.trim();
  const truncated =
    headline.length > 48 ? `${headline.slice(0, 48).trim()}…` : headline;
  return `Issue #${state.issueNum} · ${truncated}`;
}

export function getNewsletterScheduleStatus(
  publishAt: string | null,
  now = Date.now()
): NewsletterScheduleStatus {
  if (!publishAt) return "none";

  const ts = new Date(publishAt).getTime();
  if (Number.isNaN(ts)) return "none";

  return ts > now ? "scheduled" : "due";
}

export function formatPublishAt(iso: string | null): string {
  if (!iso) return "Not scheduled";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const NEWSLETTER_STATUS_LABELS: Record<
  NewsletterPublishStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-amber-100 text-amber-700",
  },
  published: {
    label: "Published",
    className: "bg-green-100 text-green-700",
  },
};

export const NEWSLETTER_SCHEDULE_LABELS: Record<
  Exclude<NewsletterScheduleStatus, "none">,
  { label: string; className: string }
> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-brand-100 text-brand-700",
  },
  due: {
    label: "Due",
    className: "bg-violet-100 text-violet-700",
  },
};
