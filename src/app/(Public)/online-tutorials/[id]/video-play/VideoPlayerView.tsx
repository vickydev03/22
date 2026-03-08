"use client";
import Navbar from "@/component/Navbar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface Video {
  id: string;
  tutorialId: string;
  title: string;
  videoKey: string;
  size: number;
  order: number;
  createdAt: string;
}

interface Tutorial {
  title: string;
  thumbnail: string;
}

interface TutorialResponse {
  videos: Video[];
  tutorial: Tutorial;
}

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

/* ─── tiny helpers ─────────────────────────────────────── */
function fmtBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Plyr injection ────────────────────────────────────── */
function usePlyr(videoEl: HTMLVideoElement | null, src: string) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoEl) return;

    const injectCSS = () => {
      if (!document.querySelector('link[href*="plyr"]')) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = "https://cdn.plyr.io/3.7.8/plyr.css";
        document.head.appendChild(l);
      }
      if (!document.querySelector("#plyr-theme")) {
        const s = document.createElement("style");
        s.id = "plyr-theme";
        s.textContent = `
          :root {
            --plyr-color-main: #DAA3B0;
            --plyr-range-fill-background: #DAA3B0;
            --plyr-video-control-color: #fff;
            --plyr-video-control-color-hover: #DAA3B0;
            --plyr-control-icon-size: 17px;
            --plyr-font-family: 'Inter', sans-serif;
            --plyr-font-size-base: 12px;
            --plyr-control-radius: 6px;
            --plyr-video-controls-background: linear-gradient(transparent, rgba(0,0,0,0.80));
          }
          .plyr--video .plyr__controls { padding: 14px 18px 16px; gap: 10px; }
          .plyr--full-ui input[type=range] { color: #DAA3B0; }
          .plyr__progress__buffer { color: rgba(218,163,176,0.25); }
          .plyr__menu__container { background: rgba(15,10,18,0.95); border: 1px solid rgba(218,163,176,0.2); border-radius: 10px; }
          .plyr__menu__container .plyr__control { color: rgba(255,255,255,0.8); }
          .plyr__menu__container .plyr__control--back { color: #DAA3B0; }
        `;
        document.head.appendChild(s);
      }
    };

    const init = async () => {
      injectCSS();
      if (!window.Plyr) {
        await new Promise<void>((res, rej) => {
          const sc = document.createElement("script");
          sc.src = "https://cdn.plyr.io/3.7.8/plyr.polyfilled.js";
          sc.onload = () => res();
          sc.onerror = () => rej();
          document.head.appendChild(sc);
        });
      }
      if (playerRef.current) playerRef.current.destroy();
      playerRef.current = new (window as any).Plyr(videoEl, {
        controls: ["play-large","play","progress","current-time","duration","mute","volume","settings","pip","fullscreen"],
        settings: ["quality","speed"],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: false },
      });
    };

    init().catch(console.error);
    return () => { playerRef.current?.destroy(); playerRef.current = null; };
  }, [videoEl]);

  /* swap source when lesson changes */
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !src) return;
    p.source = { type: "video", sources: [{ src, type: "video/mp4" }] };
  }, [src]);
}

/* ─── Equalizer icon (animated) ────────────────────────── */
function EqBars() {
  return (
    <span className="flex items-end gap-[2px] h-3 w-4">
      {[1,2,3].map(i => (
        <span key={i} className="w-[3px] rounded-full bg-[#DAA3B0]"
          style={{ animation: `eq 0.9s ease-in-out infinite`, animationDelay: `${i*0.18}s`, height: "100%" }} />
      ))}
    </span>
  );
}

/* ─── Single lesson row ─────────────────────────────────── */
function LessonRow({
  video, index, isActive, isCompleted,
  onClick,
}: {
  video: Video; index: number; isActive: boolean; isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full text-left px-4 py-3.5 flex items-center gap-3.5 group transition-all duration-200 border-b border-white/[0.05] last:border-0"
      style={{ background: isActive ? "rgba(218,163,176,0.10)" : "transparent" }}
    >
      {/* indicator */}
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: isActive ? "rgba(218,163,176,0.2)" : isCompleted ? "rgba(218,163,176,0.08)" : "rgba(255,255,255,0.04)",
          border: isActive ? "1.5px solid rgba(218,163,176,0.6)" : "1.5px solid rgba(255,255,255,0.08)",
        }}>
        {isActive ? <EqBars /> : isCompleted ? (
          <svg width="13" height="13" fill="none" viewBox="0 0 14 14">
            <path d="M2.5 7l3.5 3.5 5.5-6.5" stroke="#DAA3B0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <span className="text-[10px] font-semibold tabular-nums"
            style={{ color: "rgba(255,255,255,0.35)" }}>{index + 1}</span>
        )}
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-snug transition-colors duration-150"
          style={{ color: isActive ? "#DAA3B0" : "rgba(255,255,255,0.82)" }}>
          {video.title}
        </p>
        <p className="text-[11px] mt-0.5 text-white/35">{fmtBytes(video.size)}</p>
      </div>

      {/* hover arrow */}
      <svg width="14" height="14" fill="none" viewBox="0 0 14 14"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0"
        style={{ color: "#DAA3B0" }}>
        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/* ─── Main view ─────────────────────────────────────────── */
function VideoPlayerView({ tutorialId, userId }: { userId: string; tutorialId: string }) {
  const trpc = useTRPC();
  const { data: datas } = useSuspenseQuery(
    trpc.tutorials.playVideos.queryOptions({ tutorialId, userId })
  );
  const data = datas as TutorialResponse;

  const sortedVideos = [...data.videos].sort((a, b) => a.order - b.order);
  const [activeIdx, setActiveIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  const activeVideo = sortedVideos[activeIdx];
  const activeSrc = activeVideo ? `${R2}/${activeVideo.videoKey}` : "";

  const callbackRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    setVideoEl(el);
  }, []);

  usePlyr(videoEl, activeSrc);

  const selectLesson = (idx: number) => {
    if (activeIdx !== idx) {
      setCompleted(prev => new Set([...prev, sortedVideos[activeIdx].id]));
    }
    setActiveIdx(idx);
  };

  const completedCount = completed.size;
  const progress = sortedVideos.length ? Math.round((completedCount / sortedVideos.length) * 100) : 0;

  return (
    <div className="bg-hero min-h-screen w-full relative overflow-hidden">
      {/* Navbar */}
      <div className="absolute z-50 w-full top-5">
        <Navbar />
      </div>

      {/* Subtle dark veil so content is readable over hero bg */}
      {/* <div className="absolute inset-0 bg-black/30 pointer-events-none" /> */}

      {/* Page content */}
      <div className="relative z-10 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2 font-medium">Course</p>
          <h2 className="font-passion-one text-3xl md:text-5xl text-[#DAA3B0] uppercase tracking-wide leading-none">
            {data.tutorial.title}
          </h2>

          {/* progress strip */}
          <div className="mt-5 flex items-center gap-4 max-w-md">
            <div className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#DAA3B0,#c47c8f)" }} />
            </div>
            <span className="text-white/40 text-[11px] tabular-nums shrink-0">
              {completedCount} / {sortedVideos.length} lessons
            </span>
          </div>
        </div>

        {/* ── Player + sidebar grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-0 rounded-2xl overflow-hidden shadow-sm shadow-black/60"
          style={{ border: "1px solid rgba(255,255,255,0.09)" }}>

          {/* LEFT — player column */}
          <div className="flex flex-col" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(24px)" }}>
            {/* 16:9 video */}
            <div className="relative w-full" style={{ aspectRatio: "16/9", background: "#0a0608" }}>
              <video ref={callbackRef} className="w-full h-full" playsInline src={activeSrc} />
            </div>

            {/* now-playing bar */}
            <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] text-white/35 uppercase tracking-widest mb-1">
                    Lesson {activeIdx + 1} of {sortedVideos.length}
                  </p>
                  <h3 className="text-white font-semibold text-base md:text-lg leading-snug truncate">
                    {activeVideo?.title}
                  </h3>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1.5 mt-0.5">
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{ border: "1px solid rgba(218,163,176,0.35)", color: "#DAA3B0", background: "rgba(218,163,176,0.08)" }}>
                    {activeVideo ? fmtBytes(activeVideo.size) : ""}
                  </span>
                </div>
              </div>

              {/* prev / next */}
              <div className="mt-4 flex gap-2">
                <button onClick={() => activeIdx > 0 && selectLesson(activeIdx - 1)}
                  disabled={activeIdx === 0}
                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-30"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  ← Previous
                </button>
                <button onClick={() => activeIdx < sortedVideos.length - 1 && selectLesson(activeIdx + 1)}
                  disabled={activeIdx === sortedVideos.length - 1}
                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-30"
                  style={{ background: "rgba(218,163,176,0.15)", color: "#DAA3B0", border: "1px solid rgba(218,163,176,0.25)" }}>
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — lesson list */}
          <div className="flex flex-col border-l" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.50)", backdropFilter: "blur(24px)" }}>
            {/* header */}
            <div className="px-4 py-3.5 border-b flex items-center justify-between"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Lessons</p>
              <span className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: "rgba(218,163,176,0.1)", color: "#DAA3B0" }}>
                {sortedVideos.length}
              </span>
            </div>

            {/* scrollable list */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: "420px" }}>
              {sortedVideos.map((v, i) => (
                <LessonRow key={v.id} video={v} index={i}
                  isActive={i === activeIdx}
                  isCompleted={completed.has(v.id)}
                  onClick={() => selectLesson(i)} />
              ))}
            </div>

            {/* thumbnail footer */}
            {data.tutorial.thumbnail && (
              <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <img src={data.tutorial.thumbnail} alt={data.tutorial.title}
                  className="w-full rounded-xl object-cover opacity-60"
                  style={{ aspectRatio: "16/9" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Equalizer keyframe */}
      <style>{`
        @keyframes eq {
          0%,100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default VideoPlayerView;