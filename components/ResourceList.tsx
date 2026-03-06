"use client";

import {
  ExternalLink,
  Video,
  FileText,
  BookOpen,
  GraduationCap,
  Search,
  HelpCircle,
} from "lucide-react";
import type { Resource, ResourceType } from "@/lib/types";

const TYPE_ICONS: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  youtube: Video,
  video: Video,
  article: FileText,
  docs: FileText,
  book: BookOpen,
  course: GraduationCap,
};

const VERIFY_LINK_TOOLTIP =
  "Links are base URLs — search within the site for the exact resource.";

interface ResourceListProps {
  resources: Resource[];
}

function YouTubeChannelCard({
  res,
  index,
}: {
  res: Resource;
  index: number;
}) {
  const searchQuery = res.searchQuery || res.title;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  return (
    <div
      key={`channel-${res.url}-${index}`}
      className="rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-200 flex items-center justify-center">
          <Video className="h-7 w-7 text-gray-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[var(--foreground)] truncate">
            {res.title}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
            >
              Open channel
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
            >
              <Search className="h-3.5 w-3.5" />
              Search on YouTube
            </a>
          </div>
          {searchQuery && (
            <p className="text-xs text-[var(--muted)] mt-1.5">
              🔍 Can&apos;t find it? Search: {searchQuery}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
            res.isFree ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"
          }`}
        >
          {res.isFree ? "Free" : "Paid"}
        </span>
      </div>
    </div>
  );
}

function YouTubeEmbed({ res, index }: { res: Resource; index: number }) {
  const videoParam = res.url.split("v=")[1];
  const videoId = videoParam?.split("&")[0];
  if (!videoId) return null;

  return (
    <div
      key={`embed-${videoId}-${index}`}
      className="bg-black rounded-xl overflow-hidden shadow-md"
    >
      <div className="w-full aspect-video">
        <iframe
          className="w-full h-full border-0"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={res.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between text-sm mt-1 px-2 py-1 bg-sky-100">
        <a
          href={res.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[var(--foreground)] hover:underline"
        >
          <span className="truncate">{res.title}</span>
          <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
        </a>
        <span
          className={`ml-2 shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
            res.isFree ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"
          }`}
        >
          {res.isFree ? "Free" : "Paid"}
        </span>
      </div>
    </div>
  );
}

export function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) return null;

  const youtubeResources = resources.filter((r) => r.type === "youtube");
  const youtubeEmbeds = youtubeResources.filter(
    (r) => r.embedType === "video" && r.url.includes("v=")
  );
  const youtubeChannels = youtubeResources.filter(
    (r) => r.embedType !== "video" || !r.url.includes("v=")
  );
  const nonYoutubeResources = resources.filter((r) => r.type !== "youtube");

  const hasRecommendedNonYoutube = nonYoutubeResources.some(
    (r) => r.isRecommended
  );
  const firstNonYoutube = nonYoutubeResources[0];

  const nonYoutubeOrder: ResourceType[] = [
    "course",
    "article",
    "docs",
    "book",
    "video",
  ];

  const hasYoutube = youtubeEmbeds.length > 0 || youtubeChannels.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[var(--muted)]">
          Resources
        </h3>
        <span
          className="text-[var(--muted)] cursor-help"
          title={VERIFY_LINK_TOOLTIP}
          aria-label="Verify link hint"
        >
          <HelpCircle className="h-4 w-4" />
        </span>
      </div>

      {hasYoutube && (
        <section className="rounded-xl bg-sky-100/80 p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Video lessons
          </p>
          <div className="space-y-4">
            {youtubeEmbeds.map((res, index) => (
              <YouTubeEmbed key={`embed-${index}`} res={res} index={index} />
            ))}
            {youtubeChannels.map((res, index) => (
              <YouTubeChannelCard
                key={`channel-${index}`}
                res={res}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {hasYoutube && nonYoutubeResources.length > 0 && (
        <hr className="border-sky-200" />
      )}

      {nonYoutubeResources.length > 0 && (
        <section className="rounded-xl bg-sky-100/80 p-3">
          {nonYoutubeOrder.map((type) => {
            const list = nonYoutubeResources.filter((r) => r.type === type);
            if (!list.length) return null;
            const Icon = TYPE_ICONS[type];
            return (
              <div key={type} className="mt-2 first:mt-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {type}
                </p>
                <ul className="space-y-1.5">
                  {list.map((res) => {
                    const isActive =
                      res.isRecommended ||
                      (!hasRecommendedNonYoutube &&
                        firstNonYoutube &&
                        res === firstNonYoutube);

                    const TypeIcon = TYPE_ICONS[res.type];
                    const isArticle = res.type === "article";
                    const devToSearch = res.searchQuery
                      ? `https://dev.to/search?q=${encodeURIComponent(res.searchQuery)}`
                      : null;

                    return (
                      <li key={`${res.url}-${res.title}`}>
                        <div
                          className={`flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/40 transition border ${isActive ? "bg-amber-100 border-amber-200" : "border-transparent"}`}
                          title={VERIFY_LINK_TOOLTIP}
                        >
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 min-w-0 flex-1"
                          >
                            <TypeIcon className="h-4 w-4 text-gray-500 shrink-0" />
                            <span className="min-w-0 truncate hover:underline">
                              {res.title}
                            </span>
                          </a>
                          {isArticle && devToSearch && (
                            <a
                              href={devToSearch}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-[var(--primary)] hover:bg-white/60 border border-[var(--border)]"
                            >
                              <Search className="h-3 w-3" />
                              Search on DEV.to
                            </a>
                          )}
                          <span
                            className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
                              res.isFree
                                ? "text-green-600 bg-green-50"
                                : "text-amber-600 bg-amber-50"
                            }`}
                          >
                            {res.isFree ? "Free" : "Paid"}
                          </span>
                        </div>
                        {res.searchQuery && (
                          <p className="text-xs text-[var(--muted)] mt-1 px-3 pb-1">
                            🔍 Can&apos;t find it? Search: {res.searchQuery}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
