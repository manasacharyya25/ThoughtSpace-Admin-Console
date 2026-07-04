"use client";

import { useMemo, useState } from "react";
import { CheckCircle } from "lucide-react";
import { ControlPanel } from "@/components/newsletter/control-panel";
import { PreviewPane } from "@/components/newsletter/preview-pane";
import {
  createDefaultNewsletterState,
  DEFAULT_ACCORDION_STATE,
  PROMPT_COLORS,
} from "@/lib/newsletter/default-state";
import { generateEmailHTML } from "@/lib/newsletter/generate-email-html";
import { cn } from "@/lib/utils";
import type {
  AccordionSection,
  AccordionState,
  NewsletterState,
} from "@/types/newsletter";

export function NewsletterBuilder() {
  const [state, setState] = useState<NewsletterState>(() =>
    createDefaultNewsletterState()
  );
  const [accordion, setAccordion] =
    useState<AccordionState>(DEFAULT_ACCORDION_STATE);
  const [activeTab, setActiveTab] = useState<"preview" | "source">("preview");
  const [viewportWidth, setViewportWidth] = useState("600px");
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

  return (
    <div className="px-4 pb-4">
      <div className="flex h-[calc(100vh-180px)] min-h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ControlPanel
          state={state}
          accordion={accordion}
          onAccordionToggle={toggleAccordion}
          onUpdateField={updateField}
          onUpdateArticle={updateArticle}
          onUpdatePrompt={updatePrompt}
          onUpdateRec={updateRec}
          onUpdateCta={updateCta}
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
  );
}
