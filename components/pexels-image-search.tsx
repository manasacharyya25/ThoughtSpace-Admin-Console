"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Loader2, Search } from "lucide-react";
import { Button, FieldError, Input, Label } from "@/components/ui";
import type { PexelsPhotoResult } from "@/lib/pexels";

type PexelsImageSearchProps = {
  defaultQuery?: string;
  onSelect: (photo: PexelsPhotoResult) => void;
  disabled?: boolean;
};

export function PexelsImageSearch({
  defaultQuery = "",
  onSelect,
  disabled,
}: PexelsImageSearchProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [photos, setPhotos] = useState<PexelsPhotoResult[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<PexelsPhotoResult | null>(
    null
  );
  const [resultsOpen, setResultsOpen] = useState(false);
  const [confirmedPhoto, setConfirmedPhoto] = useState<PexelsPhotoResult | null>(
    null
  );

  async function runSearch(nextPage = 1, append = false) {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter a keyword to search");
      return;
    }

    setLoading(true);
    setError("");
    setResultsOpen(true);
    setPendingPhoto(null);

    const response = await fetch(
      `/api/pexels/search?q=${encodeURIComponent(trimmed)}&page=${nextPage}`
    );

    const data = (await response.json()) as {
      photos?: PexelsPhotoResult[];
      hasMore?: boolean;
      error?: string;
    };

    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Search failed");
      return;
    }

    const results = data.photos ?? [];
    setPhotos(append ? (prev) => [...prev, ...results] : results);
    setPage(nextPage);
    setHasMore(data.hasMore ?? false);
  }

  function handlePick(photo: PexelsPhotoResult) {
    setPendingPhoto(photo);
  }

  function confirmSelection() {
    if (!pendingPhoto) return;
    onSelect(pendingPhoto);
    setConfirmedPhoto(pendingPhoto);
    setPendingPhoto(null);
    setPhotos([]);
    setResultsOpen(false);
    setHasMore(false);
  }

  function openSearchAgain() {
    setResultsOpen(true);
    setPendingPhoto(confirmedPhoto);
    if (photos.length === 0 && query.trim()) {
      void runSearch(1, false);
    }
  }

  return (
    <div className="mb-6 rounded-xl border-2 border-brand-200 bg-brand-50/40 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-800">
            Search Pexels stock photos
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Search by keyword, pick a photo, then confirm with Select to fill
            the fields below.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="min-w-[200px] flex-1">
          <Label htmlFor="pexels-query" className="sr-only">
            Search keywords
          </Label>
          <Input
            id="pexels-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void runSearch(1, false);
              }
            }}
            placeholder="e.g. anonymous conversation, friendship, privacy"
            disabled={disabled || loading}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || loading}
          onClick={() => void runSearch(1, false)}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </Button>
      </div>

      <FieldError message={error} />

      {confirmedPhoto && !resultsOpen && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-slate-200">
              <Image
                src={confirmedPhoto.previewUrl}
                alt={confirmedPhoto.alt}
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            </div>
            <p className="text-sm text-green-800">
              Selected photo by{" "}
              <span className="font-medium">{confirmedPhoto.photographer}</span>
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={openSearchAgain}
          >
            Change photo
          </Button>
        </div>
      )}

      {resultsOpen && photos.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                disabled={disabled}
                onClick={() => handlePick(photo)}
                className={`group relative overflow-hidden rounded-lg border-2 text-left transition ${
                  pendingPhoto?.id === photo.id
                    ? "border-brand-500 ring-2 ring-brand-200"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <div className="relative aspect-[4/3] bg-slate-200">
                  <Image
                    src={photo.previewUrl}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="160px"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="truncate text-[0.65rem] font-medium text-white">
                    {photo.photographer}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="mt-3">
              <Button
                type="button"
                variant="ghost"
                disabled={disabled || loading}
                onClick={() => void runSearch(page + 1, true)}
              >
                Load more
              </Button>
            </div>
          )}

          {pendingPhoto && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-200">
                  <Image
                    src={pendingPhoto.previewUrl}
                    alt={pendingPhoto.alt}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {pendingPhoto.photographer}
                  </p>
                  <p className="text-xs text-slate-500">Use as hero image?</p>
                </div>
              </div>
              <Button
                type="button"
                disabled={disabled}
                onClick={confirmSelection}
              >
                <Check className="h-4 w-4" />
                Select
              </Button>
            </div>
          )}
        </>
      )}

      <p className="mt-3 text-[0.65rem] text-slate-400">
        Photos provided by{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600"
        >
          Pexels
        </a>
        .
      </p>
    </div>
  );
}
