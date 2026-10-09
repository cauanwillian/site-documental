"use client";
import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import type { Video } from "@/lib/data";
import { Button } from "@/components/ui/button";
export function VideoPlayer({ video }: { video: Video }) {
  const [loaded, setLoaded] = useState(false);
  if (
    !/^[A-Za-z0-9_-]{11}$/.test(video.videoId) ||
    !Number.isInteger(video.startSeconds) ||
    !Number.isInteger(video.endSeconds) ||
    video.startSeconds < 0 ||
    video.endSeconds <= video.startSeconds
  )
    return null;
  const embed = `https://www.youtube-nocookie.com/embed/${video.videoId}?start=${video.startSeconds}&end=${video.endSeconds}&rel=0`;
  const external = `https://www.youtube.com/watch?v=${video.videoId}&t=${video.startSeconds}s`;
  const time = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <figure className="overflow-hidden rounded-lg border border-neutral-200">
      <div className="aspect-video bg-black">
        {loaded ? (
          <iframe
            src={embed}
            title={video.title}
            className="h-full w-full border-0"
            loading="lazy"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <Button
              onClick={() => setLoaded(true)}
              aria-label={`Carregar vídeo: ${video.title}`}
            >
              <Play className="size-4" aria-hidden="true" />
              Carregar vídeo
            </Button>
          </div>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 text-xs text-stone-600">
        <span>
          Trecho: {time(video.startSeconds)}–{time(video.endSeconds)}
        </span>
        <a
          href={external}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-800 underline underline-offset-4"
        >
          Assistir no YouTube
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
