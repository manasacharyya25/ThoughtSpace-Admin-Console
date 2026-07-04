"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { generateEmailHTML } from "@/lib/newsletter/generate-email-html";
import type { NewsletterRow } from "@/types/newsletter";

type NewsletterPreviewModalProps = {
  newsletter: NewsletterRow | null;
  onClose: () => void;
};

export function NewsletterPreviewModal({
  newsletter,
  onClose,
}: NewsletterPreviewModalProps) {
  const [viewportWidth, setViewportWidth] = useState<"600px" | "410px">(
    "600px"
  );

  const html = useMemo(
    () => (newsletter ? generateEmailHTML(newsletter.state) : ""),
    [newsletter]
  );

  useEffect(() => {
    if (!newsletter) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [newsletter, onClose]);

  if (!newsletter) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-preview-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2
              id="newsletter-preview-title"
              className="text-sm font-semibold text-slate-900"
            >
              Newsletter preview
            </h2>
            <p className="text-xs text-slate-500">
              Issue #{newsletter.state.issueNum} · {newsletter.state.issueDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewportWidth("600px")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                viewportWidth === "600px"
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              600px
            </button>
            <button
              type="button"
              onClick={() => setViewportWidth("410px")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                viewportWidth === "410px"
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              410px
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-6">
          <div
            className="w-full transition-all duration-300"
            style={{ maxWidth: viewportWidth }}
          >
            <div className="min-h-[500px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <iframe
                title="Newsletter preview"
                srcDoc={html}
                className="h-[70vh] min-h-[500px] w-full border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
