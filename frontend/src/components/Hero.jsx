
import React from "react";
import { SystemClock } from "./CyberUI";
import { ChevronRight } from "lucide-react";

export default function Hero({ onEnter }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-grid scanlines noise crt-flicker">
      <div className="stars" />

      {/* top hud */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rotate-45 border border-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]" />
          <span className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase">
            NEON.ARCHIVE / NODE-04
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase">
            ACCESS // GRANTED
          </span>
          <SystemClock />
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="font-hud text-[11px] tracking-[0.4em] text-[var(--cyan-soft)] uppercase mb-5 flex items-center gap-3">
              <span className="dot" />
              SUBJECT // A-34 :: MEDIA ARCHIVE
              <span className="opacity-50">/</span>
              <span className="font-jp text-[11px]">
                シネマ保管庫
              </span>
            </div>

            <h1
              className="font-display font-black uppercase leading-[0.85] mb-6"
              style={{ fontSize: "clamp(56px, 11vw, 168px)" }}
            >
              <span className="glitch block" data-text="NEON">
                NEON
              </span>

              <span
                className="holo-text block"
                style={{
                  textShadow: "0 0 40px rgba(0,225,255,0.2)",
                }}
              >
                ARCHIVE
              </span>
            </h1>

            <div className="max-w-xl space-y-4">
              <p className="font-body text-[var(--ice)] text-base md:text-lg leading-relaxed opacity-90">
                A futuristic media vault for cinematic data. Catalogue, borrow
                and trace every disc through a holographic system terminal —
                designed for archivists of tomorrow.
              </p>

              <p className="font-jp text-[var(--cyan-soft)] text-sm opacity-70">
                未来のシネマアーカイブ // 全てのデータはここに保管される
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnter}
                className="btn-neon group flex items-center gap-3"
                data-testid="hero-access-terminal-btn"
              >
                ACCESS TERMINAL
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={onEnter}
                className="btn-neon ghost"
                data-testid="hero-insert-disc-btn"
              >
                + INSERT DISC
              </button>

              <div className="font-hud text-[10px] tracking-[0.28em] text-[var(--cyan-soft)] uppercase opacity-70 ml-2">
                v4.21 // STABLE
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)]">
              {[
                ["NAME", "TORRA.TAHA"],
                ["INCEPT", "03/05/26"],
                ["FUNCTION", "ARCHIVIST"],
                ["STATE", "ONLINE"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="bg-[var(--bg-deep)] px-4 py-3"
                >
                  <div className="font-hud text-[9px] tracking-[0.28em] text-[var(--cyan-soft)] opacity-70 uppercase">
                    {k}
                  </div>

                  <div className="font-hud text-[13px] text-[var(--bone)] mt-1">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 relative h-[420px] md:h-[560px]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="absolute w-[460px] h-[460px] rounded-full border border-[var(--line)] spin-slow" />

              <div
                className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[rgba(255,60,245,0.3)] spin-slow"
                style={{
                  animationDuration: "45s",
                  animationDirection: "reverse",
                }}
              />

              <div
                className="absolute w-[260px] h-[260px] rounded-full border border-[rgba(138,92,255,0.3)] spin-slow"
                style={{
                  animationDuration: "20s",
                }}
              />

              <div
                className="relative w-[200px] h-[200px] rounded-full overflow-hidden border border-[var(--cyan)] float-1"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #6cf0ff, #00263d 60%, #02030a 100%)",
                  boxShadow:
                    "0 0 60px rgba(0,225,255,0.4), inset 0 0 60px rgba(0,30,80,0.8)",
                }}
              >
                <div className="absolute inset-0 bg-grid-fine opacity-40" />
                <div className="absolute inset-0 scanlines" />
              </div>

              <div className="absolute top-4 right-8 holo-panel brackets px-3 py-2 float-2">
                <span className="bk-tl" />
                <span className="bk-tr" />
                <span className="bk-bl" />
                <span className="bk-br" />

                <div className="font-hud text-[9px] tracking-[0.28em] text-[var(--cyan-soft)] uppercase">
                  THREAT
                </div>

                <div className="font-display text-lg text-[var(--bone)] text-glow-magenta">
                  ★★☆
                </div>
              </div>

              <div className="absolute bottom-8 left-4 holo-panel brackets px-3 py-2 float-1">
                <span className="bk-tl" />
                <span className="bk-tr" />
                <span className="bk-bl" />
                <span className="bk-br" />

                <div className="font-hud text-[9px] tracking-[0.28em] text-[var(--cyan-soft)] uppercase">
                  WAVEFORM
                </div>

                <svg width="100" height="22" viewBox="0 0 100 22">
                  <path
                    d="M0 11 Q12 -2 24 11 T48 11 T72 11 T96 11"
                    fill="none"
                    stroke="#00e1ff"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              <div className="absolute top-10 left-0 font-pixel text-[var(--cyan-soft)] text-xl opacity-60">
                am i an angel
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-12 py-5 flex items-center justify-between border-t border-[var(--line)] bg-[rgba(0,10,30,0.55)] backdrop-blur">
        <div className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase opacity-70">
          DVD VAULT // シネマ保管庫
        </div>

        <div className="flex items-center gap-2 font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase">
          <span className="dot" />
          SYSTEM ONLINE
        </div>

        <div className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase opacity-70 hidden md:block">
          SCROLL ↓ ENTER ARCHIVE
        </div>
      </div>
    </section>
  );
}
