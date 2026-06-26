import React, { useEffect, useRef, useState } from "react";
import "@/index.css";

import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import Reports from "@/components/Reports";
import XPWindow from "@/components/XPWindow";
import { DvdForm, BorrowForm, ReturnForm } from "@/components/Forms";
import {
  Ticker,
  Panel,
  SectionLabel,
  StatBlock,
} from "@/components/CyberUI";
import { API_BASE, getDVDs, availableDVDs, borrowedDVDs } from "@/lib/api";
import { Plus, LogOut, FileMinus, Power } from "lucide-react";

function App() {
  const archiveRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({ total: 0, available: 0, borrowed: 0 });
  const [statsErr, setStatsErr] = useState("");

  // window manager
  const [windows, setWindows] = useState([]); // {id, type, data}
  const [zCounter, setZCounter] = useState(100);

  const openWin = (type, data = null) => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setZCounter((z) => z + 1);
    setWindows((w) => [
      ...w,
      {
        id,
        type,
        data,
        z: zCounter + 1,
        pos: {
          x: 80 + (w.length % 4) * 36,
          y: 90 + (w.length % 4) * 36,
        },
      },
    ]);
  };

  const closeWin = (id) => setWindows((w) => w.filter((x) => x.id !== id));

  const focusWin = (id) => {
    setZCounter((z) => z + 1);
    setWindows((w) =>
      w.map((x) => (x.id === id ? { ...x, z: zCounter + 1 } : x)),
    );
  };

  const refresh = () => setRefreshKey((k) => k + 1);

  const enterArchive = () =>
    archiveRef.current?.scrollIntoView({ behavior: "smooth" });

  // load stats
  useEffect(() => {
    (async () => {
      setStatsErr("");
      try {
        const [all, av, bo] = await Promise.all([
          getDVDs(),
          availableDVDs(),
          borrowedDVDs(),
        ]);
        setStats({
          total: Array.isArray(all) ? all.length : 0,
          available: Array.isArray(av) ? av.length : 0,
          borrowed: Array.isArray(bo) ? bo.filter((b) => !b.return_date).length : 0,
        });
      } catch (e) {
        setStatsErr(
          e?.message?.includes("Network")
            ? "OFFLINE"
            : `ERR ${e?.response?.status || ""}`,
        );
      }
    })();
  }, [refreshKey]);

  return (
    <div className="App relative">
      {/* HERO */}
      <Hero onEnter={enterArchive} />

      {/* TICKER */}
      <Ticker />

      {/* ARCHIVE */}
      <main
        ref={archiveRef}
        className="relative bg-grid scanlines"
        style={{ paddingBottom: 120 }}
      >
        <div className="stars opacity-50" />

        {/* control bar */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <div className="font-hud text-[10px] tracking-[0.32em] text-[var(--cyan-soft)] uppercase opacity-80 flex items-center gap-3">
                <span className="dot" />
                ACCESS TERMINAL // NODE-04
              </div>
              <h2
                className="font-display font-black uppercase mt-2 text-glow-cyan"
                style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "0.04em" }}
              >
                MEDIA INDEX
              </h2>
              <div className="font-jp text-[12px] text-[var(--cyan-soft)] opacity-70 mt-1">
                メディアインデックス // OPERATIONS DASHBOARD
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openWin("add")}
                className="btn-neon"
                data-testid="open-insert-disc-btn"
              >
                <Plus size={12} className="inline mr-1" /> INSERT DISC
              </button>
              <button
                onClick={() => openWin("borrow")}
                className="btn-neon ghost"
                data-testid="open-borrow-btn"
              >
                <LogOut size={12} className="inline mr-1" /> BORROW
              </button>
              <button
                onClick={() => openWin("return")}
                className="btn-neon ghost"
                data-testid="open-return-btn"
              >
                <FileMinus size={12} className="inline mr-1" /> RETURN
              </button>
            </div>
          </div>

          {/* stat grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBlock k="TOTAL DISCS // 総数" v={stats.total} testid="stat-total" />
            <StatBlock
              k="AVAILABLE // 利用可"
              v={stats.available}
              testid="stat-available"
            />
            <StatBlock
              k="BORROWED // 貸出中"
              v={stats.borrowed}
              accent="magenta"
              testid="stat-borrowed"
            />
            <Panel className="p-5" testid="stat-system">
              <div className="flex items-center justify-between">
                <div className="font-hud text-[10px] tracking-[0.28em] text-[var(--cyan-soft)] uppercase opacity-80">
                  ARCHIVE STATUS
                </div>
                <span className={`dot ${statsErr ? "magenta" : ""}`} />
              </div>
              <div
                className={`font-display text-2xl md:text-3xl font-black mt-3 ${
                  statsErr ? "text-glow-magenta" : "text-glow-cyan"
                }`}
              >
                {statsErr ? "OFFLINE" : "NOMINAL"}
              </div>
              <div className="font-pixel text-[var(--cyan-soft)] text-sm mt-2 opacity-70 break-all">
                &gt;_ {API_BASE}
              </div>
            </Panel>
          </div>

          {/* CATALOG */}
          <div className="mt-14">
            <SectionLabel
              index="02"
              label="MEDIA INDEX"
              jp="ディスク目録 // CATALOG"
              testid="catalog-section-label"
            />
            <Catalog
              onEdit={(d) => openWin("edit", d)}
              onBorrow={(d) => openWin("borrow", d)}
              refreshKey={refreshKey}
            />
          </div>

          {/* REPORTS */}
          <div className="mt-14">
            <Reports refreshKey={refreshKey} />
          </div>

          {/* footer */}
          <div className="mt-20 border-t border-[var(--line)] pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Power size={14} className="text-[var(--cyan)]" />
              <div className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase">
                NEON.ARCHIVE © 2026 // DVD VAULT
              </div>
            </div>
            <div className="font-jp text-[11px] text-[var(--cyan-soft)] opacity-70">
              シネマ保管庫 // 全データはローカルに保持される
            </div>
            <div className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase opacity-70">
              BUILD :: A-34 / TORRA.TAHA
            </div>
          </div>
        </div>

        {/* === XP-STYLE WINDOWS OVERLAY === */}
        {windows.map((w) => {
          const common = {
            key: w.id,
            z: w.z,
            initial: { x: w.pos.x, y: w.pos.y, w: 520 },
            onClose: () => closeWin(w.id),
            onFocus: () => focusWin(w.id),
          };
          if (w.type === "add")
            return (
              <XPWindow
                {...common}
                title="INSERT DISC.EXE"
                jp="新規挿入"
                testid={`win-${w.id}`}
              >
                <DvdForm
                  onClose={() => closeWin(w.id)}
                  onSaved={refresh}
                />
              </XPWindow>
            );
          if (w.type === "edit")
            return (
              <XPWindow
                {...common}
                title={`EDIT.EXE // #${w.data?.dvd_id}`}
                jp="編集モード"
                testid={`win-${w.id}`}
              >
                <DvdForm
                  initial={w.data}
                  onClose={() => closeWin(w.id)}
                  onSaved={refresh}
                />
              </XPWindow>
            );
          if (w.type === "borrow")
            return (
              <XPWindow
                {...common}
                title="BORROW.EXE"
                jp="貸出処理"
                testid={`win-${w.id}`}
              >
                <BorrowForm
                  initial={w.data}
                  onClose={() => closeWin(w.id)}
                  onSaved={refresh}
                />
              </XPWindow>
            );
          if (w.type === "return")
            return (
              <XPWindow
                {...common}
                title="RETURN.EXE"
                jp="返却処理"
                testid={`win-${w.id}`}
              >
                <ReturnForm
                  onClose={() => closeWin(w.id)}
                  onSaved={refresh}
                />
              </XPWindow>
            );
          return null;
        })}
      </main>
    </div>
  );
}

export default App;
