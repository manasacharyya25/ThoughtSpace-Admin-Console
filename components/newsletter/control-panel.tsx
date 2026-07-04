"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  HelpCircle,
  MessageSquare,
  Music,
  Plus,
  Trash2,
} from "lucide-react";
import { BlogPostPickerModal } from "@/components/newsletter/blog-post-picker-modal";
import { cn } from "@/lib/utils";
import { MAX_ARTICLE_CARDS } from "@/lib/newsletter/default-state";
import {
  inputValueToPublishAt,
  publishAtToInputValue,
} from "@/lib/newsletter/serialize";
import type { BlogPostRow } from "@/types/blog";
import type {
  AccordionSection,
  AccordionState,
  NewsletterState,
} from "@/types/newsletter";

type ControlPanelProps = {
  state: NewsletterState;
  publishAt: string | null;
  accordion: AccordionState;
  onAccordionToggle: (section: AccordionSection) => void;
  onUpdateField: <K extends keyof NewsletterState>(
    key: K,
    value: NewsletterState[K]
  ) => void;
  onUpdateArticle: (
    index: number,
    key: keyof NewsletterState["articles"][number],
    value: string
  ) => void;
  onUpdatePrompt: (
    index: number,
    key: keyof NewsletterState["prompts"][number],
    value: string
  ) => void;
  onUpdateRec: (
    key: keyof NewsletterState["recommendation"],
    value: string
  ) => void;
  onUpdateCta: (key: keyof NewsletterState["community"], value: string) => void;
  onPublishAtChange: (value: string | null) => void;
  onAddArticle: (post: BlogPostRow | null) => void;
  onRemoveArticle: (id: string) => void;
  onAddPrompt: () => void;
  onRemovePrompt: (id: string) => void;
  onToast: (message: string, isError?: boolean) => void;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-brand-500";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const smallLabelClass = "mb-0.5 block text-xs font-medium text-slate-600";
const accordionClass =
  "overflow-hidden rounded-xl border border-slate-200 bg-white";
const accordionBodyClass =
  "space-y-4 border-t border-slate-200 bg-slate-50/50 p-4";
const nestedCardClass =
  "space-y-3 rounded-lg border border-slate-200 bg-white p-3.5";

function AccordionHeader({
  section,
  icon: Icon,
  iconClass,
  title,
  open,
  onToggle,
}: {
  section: AccordionSection;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  title: string;
  open: boolean;
  onToggle: (section: AccordionSection) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(section)}
      className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
    >
      <span className="flex items-center space-x-2">
        <Icon className={cn("h-4 w-4", iconClass)} />
        <span>{title}</span>
      </span>
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          open && "rotate-180"
        )}
      />
    </button>
  );
}

export function ControlPanel({
  state,
  publishAt,
  accordion,
  onAccordionToggle,
  onUpdateField,
  onUpdateArticle,
  onUpdatePrompt,
  onUpdateRec,
  onUpdateCta,
  onPublishAtChange,
  onAddArticle,
  onRemoveArticle,
  onAddPrompt,
  onRemovePrompt,
  onToast,
}: ControlPanelProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleAddPrompt() {
    if (state.prompts.length >= 4) {
      onToast(
        "Maximum of 4 reflection prompts recommended to preserve clean newsletter pacing.",
        true
      );
      return;
    }
    onAddPrompt();
  }

  function handleRemovePrompt(id: string) {
    if (state.prompts.length <= 1) {
      onToast("A curated newsletter must carry at least 1 reflection card.", true);
      return;
    }
    onRemovePrompt(id);
  }

  function handleOpenArticlePicker() {
    if (state.articles.length >= MAX_ARTICLE_CARDS) {
      onToast(`Maximum of ${MAX_ARTICLE_CARDS} article cards per newsletter.`, true);
      return;
    }
    setPickerOpen(true);
  }

  function handleRemoveArticle(id: string) {
    if (state.articles.length <= 1) {
      onToast("A newsletter must include at least 1 article card.", true);
      return;
    }
    onRemoveArticle(id);
  }

  return (
    <aside className="w-full max-w-lg shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-6 md:w-1/2">
      <div className="space-y-6">
        {/* Meta & Hero */}
        <div className={accordionClass}>
          <AccordionHeader
            section="meta"
            icon={FileText}
            iconClass="text-brand-500"
            title="1. Issue Meta, Hero & Intro"
            open={accordion.meta}
            onToggle={onAccordionToggle}
          />
          {accordion.meta && (
            <div className={accordionBodyClass}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Issue Number</label>
                  <input
                    type="text"
                    value={state.issueNum}
                    className={inputClass}
                    onChange={(e) => onUpdateField("issueNum", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Issue Date</label>
                  <input
                    type="text"
                    value={state.issueDate}
                    className={inputClass}
                    onChange={(e) => onUpdateField("issueDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Pill Badge Accent</label>
                <input
                  type="text"
                  value={state.badgeText}
                  className={inputClass}
                  onChange={(e) => onUpdateField("badgeText", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Headline (Dark Title)</label>
                  <input
                    type="text"
                    value={state.heroHeadlineBlack}
                    className={inputClass}
                    onChange={(e) =>
                      onUpdateField("heroHeadlineBlack", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Headline (Blue Accent)</label>
                  <input
                    type="text"
                    value={state.heroHeadlineBlue}
                    className={inputClass}
                    onChange={(e) =>
                      onUpdateField("heroHeadlineBlue", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Intro Paragraph</label>
                <textarea
                  rows={4}
                  value={state.introText}
                  className={cn(inputClass, "resize-none leading-relaxed")}
                  onChange={(e) => onUpdateField("introText", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Publish date</label>
                <input
                  type="datetime-local"
                  value={publishAtToInputValue(publishAt)}
                  className={inputClass}
                  onChange={(e) =>
                    onPublishAtChange(inputValueToPublishAt(e.target.value))
                  }
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Optional — used later to auto-send this issue
                </p>
                {publishAt && (
                  <button
                    type="button"
                    onClick={() => onPublishAtChange(null)}
                    className="mt-2 text-xs font-medium text-brand-600 hover:underline"
                  >
                    Clear publish date
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Essays */}
        <div className={accordionClass}>
          <AccordionHeader
            section="essays"
            icon={BookOpen}
            iconClass="text-emerald-600"
            title="2. Essays Section"
            open={accordion.essays}
            onToggle={onAccordionToggle}
          />
          {accordion.essays && (
            <div className={accordionBodyClass}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {state.articles.length} of {MAX_ARTICLE_CARDS} article cards
                </span>
                <button
                  type="button"
                  onClick={handleOpenArticlePicker}
                  disabled={state.articles.length >= MAX_ARTICLE_CARDS}
                  className="flex items-center space-x-1 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add article</span>
                </button>
              </div>
              {state.articles.map((art, index) => (
                <div
                  key={art.id}
                  className={cn(nestedCardClass, "relative")}
                >
                  {state.articles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArticle(art.id)}
                      className="absolute right-3.5 top-3.5 text-slate-400 transition-colors hover:text-red-600"
                      title="Remove article"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    Article Card #{index + 1}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={smallLabelClass}>Category Tag</label>
                      <input
                        type="text"
                        value={art.tag}
                        className={inputClass}
                        onChange={(e) =>
                          onUpdateArticle(index, "tag", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={smallLabelClass}>Reading ETA</label>
                      <input
                        type="text"
                        value={art.readTime}
                        className={inputClass}
                        onChange={(e) =>
                          onUpdateArticle(index, "readTime", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className={smallLabelClass}>Title Text</label>
                    <input
                      type="text"
                      value={art.title}
                      className={inputClass}
                      onChange={(e) =>
                        onUpdateArticle(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={smallLabelClass}>Cover Image URL</label>
                      <input
                        type="text"
                        value={art.imageUrl}
                        className={inputClass}
                        onChange={(e) =>
                          onUpdateArticle(index, "imageUrl", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={smallLabelClass}>Article Link</label>
                      <input
                        type="text"
                        value={art.url}
                        className={inputClass}
                        onChange={(e) =>
                          onUpdateArticle(index, "url", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className={smallLabelClass}>Description</label>
                    <textarea
                      rows={2}
                      value={art.desc}
                      className={cn(inputClass, "resize-none")}
                      onChange={(e) =>
                        onUpdateArticle(index, "desc", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reflect */}
        <div className={accordionClass}>
          <AccordionHeader
            section="reflect"
            icon={HelpCircle}
            iconClass="text-purple-600"
            title="3. Reflection Prompts (Bubbles)"
            open={accordion.reflect}
            onToggle={onAccordionToggle}
          />
          {accordion.reflect && (
            <div className={accordionBodyClass}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Manage reflection prompts
                </span>
                <button
                  type="button"
                  onClick={handleAddPrompt}
                  className="flex items-center space-x-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add prompt</span>
                </button>
              </div>
              {state.prompts.map((prm, index) => (
                <div
                  key={prm.id}
                  className={cn(nestedCardClass, "relative")}
                >
                  <button
                    type="button"
                    onClick={() => handleRemovePrompt(prm.id)}
                    className="absolute right-3.5 top-3.5 text-slate-400 transition-colors hover:text-red-600"
                    title="Delete prompt"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                    {prm.num}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className={smallLabelClass}>Initials</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={prm.initials}
                        className={cn(inputClass, "uppercase")}
                        onChange={(e) =>
                          onUpdatePrompt(
                            index,
                            "initials",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={smallLabelClass}>Pill Color</label>
                      <input
                        type="color"
                        value={prm.color}
                        className="h-[38px] w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5"
                        onChange={(e) =>
                          onUpdatePrompt(index, "color", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={smallLabelClass}>Pill Tag</label>
                      <input
                        type="text"
                        value={prm.tag}
                        className={inputClass}
                        onChange={(e) =>
                          onUpdatePrompt(index, "tag", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className={smallLabelClass}>Question Text</label>
                    <textarea
                      rows={2}
                      value={prm.text}
                      className={cn(inputClass, "resize-none")}
                      onChange={(e) =>
                        onUpdatePrompt(index, "text", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={smallLabelClass}>Time Label</label>
                    <input
                      type="text"
                      value={prm.time}
                      className={inputClass}
                      onChange={(e) =>
                        onUpdatePrompt(index, "time", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendation */}
        <div className={accordionClass}>
          <AccordionHeader
            section="recs"
            icon={Music}
            iconClass="text-amber-600"
            title="4. Recommendation Showcase"
            open={accordion.recs}
            onToggle={onAccordionToggle}
          />
          {accordion.recs && (
            <div className={accordionBodyClass}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Rec Type Badge</label>
                  <input
                    type="text"
                    value={state.recommendation.type}
                    className={inputClass}
                    onChange={(e) => onUpdateRec("type", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Recommended Title</label>
                  <input
                    type="text"
                    value={state.recommendation.title}
                    className={inputClass}
                    onChange={(e) => onUpdateRec("title", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Author / Creator</label>
                  <input
                    type="text"
                    value={state.recommendation.creator}
                    className={inputClass}
                    onChange={(e) => onUpdateRec("creator", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Action Button Text</label>
                  <input
                    type="text"
                    value={state.recommendation.buttonText}
                    className={inputClass}
                    onChange={(e) => onUpdateRec("buttonText", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Cover Image URL</label>
                <input
                  type="text"
                  value={state.recommendation.imageUrl}
                  className={inputClass}
                  onChange={(e) => onUpdateRec("imageUrl", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Destination URL</label>
                <input
                  type="text"
                  value={state.recommendation.url}
                  className={inputClass}
                  onChange={(e) => onUpdateRec("url", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Commentary</label>
                <textarea
                  rows={3}
                  value={state.recommendation.desc}
                  className={cn(inputClass, "resize-none leading-relaxed")}
                  onChange={(e) => onUpdateRec("desc", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className={accordionClass}>
          <AccordionHeader
            section="cta"
            icon={MessageSquare}
            iconClass="text-brand-500"
            title="5. Continue the Conversation CTA"
            open={accordion.cta}
            onToggle={onAccordionToggle}
          />
          {accordion.cta && (
            <div className={accordionBodyClass}>
              <div>
                <label className={labelClass}>CTA Panel Title</label>
                <input
                  type="text"
                  value={state.community.title}
                  className={inputClass}
                  onChange={(e) => onUpdateCta("title", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>CTA Button Text</label>
                <input
                  type="text"
                  value={state.community.buttonText}
                  className={inputClass}
                  onChange={(e) => onUpdateCta("buttonText", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Destination Link</label>
                <input
                  type="text"
                  value={state.community.url}
                  className={inputClass}
                  onChange={(e) => onUpdateCta("url", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Community Invite Pitch</label>
                <textarea
                  rows={3}
                  value={state.community.desc}
                  className={cn(inputClass, "resize-none leading-relaxed")}
                  onChange={(e) => onUpdateCta("desc", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 pt-4 text-center">
          <span className="text-xs text-slate-400">
            ThoughtSpace Newsletter Builder
          </span>
        </div>
      </div>

      <BlogPostPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onAddArticle}
      />
    </aside>
  );
}
