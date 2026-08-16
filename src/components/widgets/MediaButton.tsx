"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// A small flowing wave line — reads as water/sound ripple rather than
// seismic activity (avoided, since it sat next to the Hazard/earthquake
// layer and looked like a quake signal). Animates by morphing between two
// phase-shifted curve shapes when playing; stays static when idle.
function FlowingWave({ animated }: { animated: boolean }) {
  const pathA = "M1 7 C 3 3, 5 3, 7 7 C 9 11, 11 11, 13 7 C 15 3, 17 3, 19 7 C 21 11, 23 11, 25 7";
  const pathB = "M1 7 C 3 11, 5 11, 7 7 C 9 3, 11 3, 13 7 C 15 11, 17 11, 19 7 C 21 3, 23 3, 25 7";
  return (
    <svg width="20" height="11" viewBox="0 0 26 14" fill="none">
      <motion.path
        d={pathA}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        animate={animated ? { d: [pathA, pathB, pathA] } : { d: pathA }}
        transition={
          animated ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } : { duration: 0 }
        }
      />
    </svg>
  );
}

const YT_PLAYLIST_ID = "PLVPt7YJKnZJALE1CRwBxiIUEJQN0XDfHy";
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
  const containerId = "indrisma-yt-player";

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
  const tooltip =
    status === "error"
      ? "INDRISMA — playback error" + (errorCode ? " (code " + errorCode + ")" : "")
      : status === "loading"
        ? "INDRISMA — loading…"
        : status === "playing"
          ? "INDRISMA — playing (click to pause)"
          : "INDRISMA — click to play";

  const colorClass =
    status === "error"
      ? "bg-[var(--danger)] text-white"
      : status === "playing"
        ? "bg-[var(--accent)] text-white"
        : "bg-[var(--info)] text-white hover:opacity-90";

  return (
    <>
      {/* Fixed small circle at every state — a wide text pill was the
          actual space problem on mobile, not just the playing-state icon. */}
      <button
        onClick={toggle}
        disabled={disabled}
        title={tooltip}
        aria-label={tooltip}
        className={
          "fixed bottom-6 left-6 z-40 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all disabled:opacity-50 " +
          colorClass
        }
      >
        <FlowingWave animated={status === "playing"} />
      </button>
      <div
        id={containerId}
        className="fixed opacity-0 pointer-events-none"
        style={{ width: 1, height: 1, bottom: 0, left: 0 }}
      />
    </>
  );
}
