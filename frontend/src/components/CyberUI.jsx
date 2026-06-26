import React, { useEffect, useState } from "react";

// Cybercore HUD chrome — corner brackets + scanlines + grid
export const Brackets = () => (
  <>
    <span className="bk-tl" />
    <span className="bk-tr" />
    <span className="bk-bl" />
    <span className="bk-br" />
  </>
);

export const Panel = ({ children, className = "", testid }) => (
  <div
    data-testid={testid}
    className={`holo-panel brackets relative ${className}`}
  >
    <Brackets />
    {children}
  </div>
);

export const SectionLabel = ({ index = "00", label, jp, testid }) => (
  <div className="flex items-end gap-4 mb-6" data-testid={testid}>
    <div className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] opacity-70">
      // {index}
    </div>

    <div className="flex-1">
      <div
        className="font-display text-2xl md:text-3xl font-black uppercase text-[var(--bone)] text-glow-cyan"
        style={{ letterSpacing: "0.06em" }}
      >
        {label}
      </div>

      {jp && (
        <div className="font-jp text-xs text-[var(--cyan-soft)] opacity-70 mt-1">
          {jp}
        </div>
      )}
    </div>

    <div className="flex-1 divider-cyber hidden md:block" />
  </div>
);

export const StatBlock = ({ k, v, accent = "cyan", testid }) => (
  <Panel className="p-5" testid={testid}>
    <div className="flex items-center justify-between">
      <div className="font-hud text-[10px] tracking-[0.28em] text-[var(--cyan-soft)] uppercase opacity-80">
        {k}
      </div>

      <span className={`dot ${accent === "magenta" ? "magenta" : ""}`} />
    </div>

    <div
      className={`font-display text-4xl md:text-5xl font-black mt-3 ${
        accent === "magenta" ? "text-glow-magenta" : "text-glow-cyan"
      }`}
    >
      {String(v).padStart(3, "0")}
    </div>

    <div className="font-pixel text-[var(--cyan-soft)] text-sm mt-2 opacity-70">
      &gt;_ SCAN COMPLETE
    </div>
  </Panel>
);

export const Ticker = () => {
  const items = [
    "NEON ARCHIVE v4.21",
    "シネマ保管庫",
    "MEDIA INDEX SYNCED",
    "ACCESS LEVEL :: 03",
    "DATA STREAM ONLINE",
    "ARCHIVE STATUS :: NOMINAL",
    "INSERT DISC",
    "BORROW LOG OPEN",
    "現在時刻 :: 03:14:07",
    "SCAN COMPLETE",
    "DVD VAULT",
  ];

  return (
    <div className="overflow-hidden border-y border-[var(--line)] bg-[rgba(0,20,50,0.55)] py-2 relative">
      <div className="ticker-track font-hud text-[11px] tracking-[0.25em] text-[var(--cyan-soft)] uppercase">
        {[...items, ...items, ...items].map((s, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="dot" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

export const SystemClock = () => {
  const [t, setT] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="font-hud text-[11px] tracking-[0.24em] text-[var(--cyan-soft)] uppercase">
      SYS // {t.toISOString().slice(0, 19).replace("T", " ")}Z
    </div>
  );
};