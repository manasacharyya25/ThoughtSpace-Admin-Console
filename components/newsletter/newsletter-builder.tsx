"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ControlPanel } from "@/components/newsletter/control-panel";
import { PreviewPane } from "@/components/newsletter/preview-pane";
import { Button } from "@/components/ui";
import { blogPostToArticle } from "@/lib/newsletter/blog-to-article";
import {
  createBlankArticle,
  createDefaultNewsletterState,
  DEFAULT_ACCORDION_STATE,
  MAX_ARTICLE_CARDS,
  PROMPT_COLORS,
} from "@/lib/newsletter/default-state";
import { generateEmailHTML } from "@/lib/newsletter/generate-email-html";
import { cn } from "@/lib/utils";
import type { BlogPostRow } from "@/types/blog";
import type {
  AccordionSection,
  AccordionState,
  NewsletterRow,
  NewsletterState,
} from "@/types/newsletter";

type NewsletterBuilderProps = {
  mode: "create" | "edit";
  siteUrl: string;
  initialRow?: NewsletterRow;
};

export function NewsletterBuilder({
  mode,
  siteUrl,
  initialRow,
}: NewsletterBuilderProps) {
  const router = useRouter();
  const [state, setState] = useState<NewsletterState>(
    () => initialRow?.state ?? createDefaultNewsletterState()
  );
  const [publishAt, setPublishAt] = useState<string | null>(
    () => initialRow?.publish_at ?? null
  );
  const [accordion, setAccordion] =
    useState<AccordionState>(DEFAULT_ACCORDION_STATE);
  const [activeTab, setActiveTab] = useState<"preview" | "source">("preview");
  const [viewportWidth, setViewportWidth] = useState("600px");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    isError: boolean;
    visible: boolean;
  }>({ message: "", isError: false, visible: false });

  const compiledHtml = useMemo(() => generateEmailHTML(state), [state]);

  function showToast(message: string, isError = false) {
    setToast({ message, isError, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }

  function toggleAccordion(section: AccordionSection) {
    setAccordion((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function updateField<K extends keyof NewsletterState>(
    key: K,
    value: NewsletterState[K]
  ) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function updateArticle(
    index: number,
    key: keyof NewsletterState["articles"][number],
    value: string
  ) {
    setState((prev) => {
      const articles = [...prev.articles];
      articles[index] = { ...articles[index], [key]: value };
      return { ...prev, articles };
    });
  }

  function updatePrompt(
    index: number,
    key: keyof NewsletterState["prompts"][number],
    value: string
  ) {
    setState((prev) => {
      const prompts = [...prev.prompts];
      prompts[index] = { ...prompts[index], [key]: value };
      return { ...prev, prompts };
    });
  }

  function updateRec(
    key: keyof NewsletterState["recommendation"],
    value: string
  ) {
    setState((prev) => ({
      ...prev,
      recommendation: { ...prev.recommendation, [key]: value },
    }));
  }

  function updateCta(key: keyof NewsletterState["community"], value: string) {
    setState((prev) => ({
      ...prev,
      community: { ...prev.community, [key]: value },
    }));
  }

  function addPrompt() {
    setState((prev) => {
      const color = PROMPT_COLORS[prev.prompts.length % PROMPT_COLORS.length];
      return {
        ...prev,
        prompts: [
          ...prev.prompts,
          {
            id: `prm-${Date.now()}`,
            num: `PROMPT #${prev.prompts.length + 1}`,
            initials: "TS",
            color,
            text: "Write down your new reflection query prompt here.",
            time: "Posted just now",
            tag: "#reflection",
            tagColor: "#f3f4f6",
            tagTextColor: "#374151",
          },
        ],
      };
    });
  }

  function removePrompt(id: string) {
    setState((prev) => {
      const prompts = prev.prompts
        .filter((p) => p.id !== id)
        .map((p, index) => ({
          ...p,
          num: `REFLECTION #${index + 1}`,
        }));
      return { ...prev, prompts };
    });
  }

  function addArticle(fromBlog: BlogPostRow | null) {
    setState((prev) => {
      if (prev.articles.length >= MAX_ARTICLE_CARDS) {
        showToast(
          `Maximum of ${MAX_ARTICLE_CARDS} article cards per newsletter.`,
          true
        );
        return prev;
      }

      const article = fromBlog
        ? blogPostToArticle(fromBlog, siteUrl)
        : createBlankArticle();

      return { ...prev, articles: [...prev.articles, article] };
    });
  }

  function removeArticle(id: string) {
    setState((prev) => ({
      ...prev,
      articles: prev.articles.filter((a) => a.id !== id),
    }));
  }

  async function copyToClipboard() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(compiledHtml);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = compiledHtml;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      showToast("Newsletter HTML copied to clipboard!");
    } catch {
      showToast("Failed to copy automatically.", true);
    }
  }

  async function handleSave() {
    setSaving(true);

    const payload = { state, publish_at: publishAt };
    const url =
      mode === "edit" && initialRow
        ? `/api/newsletters/${initialRow.id}`
        : "/api/newsletters";
    const method = mode === "edit" ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      showToast(body?.error ?? "Failed to save newsletter", true);
      return;
    }

    showToast("Newsletter saved!");
    router.push("/newsletter");
    router.refresh();
  }

  return (
    <AdminShell fullWidth>
      <div className="px-4 pb-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="flex items-start gap-3">
            <Link
              href="/newsletter"
              className="mt-1 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving…" : "Save newsletter"}
          </Button>
        </div>

        <div className="flex h-[calc(100vh-220px)] min-h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ControlPanel
            state={state}
            publishAt={publishAt}
            accordion={accordion}
            onAccordionToggle={toggleAccordion}
            onUpdateField={updateField}
            onUpdateArticle={updateArticle}
            onUpdatePrompt={updatePrompt}
            onUpdateRec={updateRec}
            onUpdateCta={updateCta}
            onPublishAtChange={setPublishAt}
            onAddArticle={addArticle}
            onRemoveArticle={removeArticle}
            onAddPrompt={addPrompt}
            onRemovePrompt={removePrompt}
            onToast={showToast}
          />
          <PreviewPane
            html={compiledHtml}
            activeTab={activeTab}
            viewportWidth={viewportWidth}
            onTabChange={setActiveTab}
            onViewportChange={setViewportWidth}
            onCopyHtml={() => void copyToClipboard()}
          />
        </div>

        <div
          className={cn(
            "pointer-events-none fixed bottom-6 right-6 flex transform items-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300",
            toast.isError ? "bg-red-600" : "bg-emerald-600",
            toast.visible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          )}
        >
          <CheckCircle className="h-4 w-4" />
          <span>{toast.message || "Done"}</span>
        </div>
      </div>
    </AdminShell>
  );
}
