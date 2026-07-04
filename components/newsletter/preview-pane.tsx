"use client";

import { Code, Copy, Eye, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

type PreviewPaneProps = {
  html: string;
  activeTab: "preview" | "source";
  viewportWidth: string;
  onTabChange: (tab: "preview" | "source") => void;
  onViewportChange: (width: string) => void;
  onCopyHtml: () => void;
};

export function PreviewPane({
  html,
  activeTab,
  viewportWidth,
  onTabChange,
  onViewportChange,
  onCopyHtml,
}: PreviewPaneProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
        <div className="flex space-x-2 py-2">
          <button
            type="button"
            onClick={() => onTabChange("preview")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === "preview"
                ? "border border-brand-200 bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span className="flex items-center space-x-1.5">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("source")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === "source"
                ? "border border-brand-200 bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span className="flex items-center space-x-1.5">
              <Code className="h-4 w-4" />
              <span>HTML source</span>
            </span>
          </button>
          <Button
            type="button"
            onClick={onCopyHtml}
            className="px-3 py-2 text-xs"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy compiled HTML
          </Button>
        </div>

        {activeTab === "preview" && (
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => onViewportChange("600px")}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              title="Desktop layout (600px)"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("410px")}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              title="Mobile layout (410px)"
            >
              <Tablet className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 justify-center overflow-y-auto bg-slate-100 p-6">
        {activeTab === "preview" ? (
          <div
            className="flex h-full w-full justify-center transition-all duration-300"
            style={{ maxWidth: viewportWidth }}
          >
            <div className="h-full min-h-[500px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <iframe
                title="Newsletter preview"
                srcDoc={html}
                className="h-full w-full border-0"
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col">
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-xs text-slate-500">
                <span>thoughtspace_newsletter.html</span>
                <span className="font-semibold uppercase text-brand-600">
                  Ready for ESP import
                </span>
              </div>
              <textarea
                readOnly
                value={html}
                className="min-h-[500px] flex-1 resize-none overflow-y-auto bg-white p-5 font-mono text-xs text-slate-700 selection:bg-brand-100 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
