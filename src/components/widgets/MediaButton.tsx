"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

function WaveBars() {
  const heights = [0.5, 0.85, 0.6, 1, 0.7, 0.9, 0.55, 0.75, 0.45];
  return (
    <div className="flex items-end gap-[2px] h-3">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-current"
          animate={{ scaleY: [0.2, h, 0.2] }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.35 + i * 0.04,
            ease: "easeInOut",
          }}
          style={{ originY: 1, height: "100%" }}
        />
      ))}
    </div>
  );
}

const YT_PLAYLIST_ID = "PLVPt7YJKnZJCUE9WQ0ffocb0NJJ5sHjcS";
const YT_VIDEO_ID = "";

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  unMute: () => void;
}

interface YTPlayerOptions {
  height: string;
  width: string;
  videoId?: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady: () => void;
    onError?: (event: { data: number }) => void;
  };
}

interface YTNamespace {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayerInstance;
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });
  return apiPromise;
}

type Status = "loading" | "ready" | "playing" | "error";

export function MediaButton() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const containerId = "aetheria-yt-player";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus((current) => {
        if (current === "loading") {
          console.error("[MediaButton] YouTube IFrame API failed to load within 8s.");
          return "error";
        }
        return current;
      });
    }, 8000);

    loadYouTubeApi().then(() => {
      clearTimeout(timeout);

      const events = {
        onReady: () => setStatus("ready"),
        onError: (e: { data: number }) => {
          console.error("[MediaButton] YouTube player error, code:", e.data);
          setErrorCode(e.data);
          setStatus("error");
        },
      };

      // Build options WITHOUT a `videoId` key at all when in playlist mode —
      // even `videoId: undefined` being present as a key (rather than
      // omitted entirely) makes YouTube's widget API throw "Invalid video
      // id", since it checks key presence, not truthiness. Same logic
      // applied to playerVars: only include the keys actually relevant to
      // the current mode.
      if (YT_VIDEO_ID) {
        playerRef.current = new window.YT.Player(containerId, {
          height: "1",
          width: "1",
          videoId: YT_VIDEO_ID,
          playerVars: { playlist: YT_VIDEO_ID, loop: 1, autoplay: 0 },
          events,
        });
      } else {
        playerRef.current = new window.YT.Player(containerId, {
          height: "1",
          width: "1",
          playerVars: { listType: "playlist", list: YT_PLAYLIST_ID, loop: 1, autoplay: 0 },
          events,
        });
      }
    });

    return () => clearTimeout(timeout);
  }, []);

  const toggle = useCallback(() => {
    if (!playerRef.current) return;
    if (status === "playing") {
      playerRef.current.pauseVideo();
      setStatus("ready");
    } else if (status === "ready") {
      playerRef.current.unMute();
      playerRef.current.playVideo();
      setStatus("playing");
    }
  }, [status]);

  const disabled = status === "loading" || status === "error";
  const label = status === "error" ? "PLAYBACK ERROR" : status === "loading" ? "..." : "AETHERIA";

  const baseClass =
    "fixed bottom-6 left-6 z-40 flex items-center justify-center px-4 py-3 rounded-full font-mono text-xs font-semibold shadow-lg transition-all min-w-[110px] disabled:opacity-50";
  const colorClass =
    status === "error"
      ? "bg-[var(--danger)] text-white"
      : status === "playing"
        ? "bg-[var(--accent)] text-white"
        : "bg-[var(--info)] text-white hover:opacity-90";

  return (
    <>
      <button onClick={toggle} disabled={disabled} className={baseClass + " " + colorClass} title={errorCode ? "YouTube error code: " + errorCode : undefined}>
        {status === "playing" ? <WaveBars /> : <span>{label}</span>}
      </button>
      <div id={containerId} className="fixed opacity-0 pointer-events-none" style={{ width: 1, height: 1, bottom: 0, left: 0 }} />
    </>
  );
}
