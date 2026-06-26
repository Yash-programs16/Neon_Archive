
import React, { useEffect, useState } from "react";
import { Panel, SectionLabel } from "./CyberUI";
import { availableDVDs, borrowedDVDs, generateFine } from "../lib/api";
import { AlertTriangle } from "lucide-react";

export default function Reports({ refreshKey }) {
  const [tab, setTab] = useState("available");
  const [available, setAvailable] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [fineMsg, setFineMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");

    try {
      const [a, b] = await Promise.all([
        availableDVDs(),
        borrowedDVDs(),
      ]);

      setAvailable(Array.isArray(a) ? a : []);
      setBorrowed(Array.isArray(b) ? b : []);
    } catch (e) {
      setErr(
        e?.message?.includes("Network")
          ? "BACKEND OFFLINE :: run your Go server on :8000"
          : e?.message || "ERROR"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    
  }, [refreshKey]);

  const runFine = async () => {
    setFineMsg(null);

    try {
      await generateFine();
      setFineMsg({
        ok: true,
        text: "FINES RECOMPUTED",
      });

      await load();
    } catch (e) {
      setFineMsg({
        ok: false,
        text: e?.message || "FINE GEN FAILED",
      });
    }
  };

  return (
    <div>
      <SectionLabel
        index="03"
        label="ARCHIVE STATUS"
        jp="アーカイブ状況 // REPORTS"
        testid="reports-section-label"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1">
          <button
            className={`tab-btn ${tab === "available" ? "active" : ""}`}
            onClick={() => setTab("available")}
            data-testid="reports-tab-available"
          >
            AVAILABLE [{available.length}]
          </button>

          <button
            className={`tab-btn ${tab === "borrowed" ? "active" : ""}`}
            onClick={() => setTab("borrowed")}
            data-testid="reports-tab-borrowed"
          >
            BORROWED [{borrowed.length}]
          </button>
        </div>

        <div className="flex items-center gap-3">
          {fineMsg && (
            <span
              className={`font-hud text-[10px] tracking-[0.28em] uppercase ${
                fineMsg.ok
                  ? "text-[var(--cyan)]"
                  : "text-[var(--magenta)]"
              }`}
            >
              {fineMsg.text}
            </span>
          )}

          <button
            onClick={runFine}
            className="btn-neon magenta"
            data-testid="reports-generate-fine-btn"
          >
            <AlertTriangle size={11} className="inline mr-1" />
            GENERATE FINE
          </button>
        </div>
      </div>

      <Panel className="p-5" testid="reports-panel">
        {loading && <div className="h-[2px] shimmer mb-3" />}

        {err && (
          <div className="font-hud text-[11px] tracking-[0.28em] text-[var(--magenta)] uppercase mb-3">
            !! {err}
          </div>
        )}

        {tab === "available" && (
          <table className="cyber-table">
            <thead>
              <tr>
                <th>//</th>
                <th>ID</th>
                <th>TITLE</th>
                <th>DIRECTOR</th>
                <th>GENRE</th>
              </tr>
            </thead>

            <tbody>
              {available.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-8 opacity-60">
                    NO AVAILABLE DISCS
                  </td>
                </tr>
              )}

              {available.map((d, i) => (
                <tr key={d.dvd_id || i}>
                  <td className="text-[var(--cyan-soft)]">
                    {String(i + 1).padStart(3, "0")}
                  </td>

                  <td className="text-[var(--cyan)]">
                    #{d.dvd_id}
                  </td>

                  <td className="font-display uppercase tracking-wider">
                    {d.dvd_name}
                  </td>

                  <td>{d.director}</td>

                  <td className="text-[var(--cyan-soft)]">
                    {d.genre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "borrowed" && (
          <table className="cyber-table">
            <thead>
              <tr>
                <th>SR</th>
                <th>BORROWER</th>
                <th>DVD_ID</th>
                <th>ISSUED</th>
                <th>RETURNED</th>
                <th>FINE</th>
              </tr>
            </thead>

            <tbody>
              {borrowed.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-8 opacity-60">
                    NO BORROW LOGS
                  </td>
                </tr>
              )}

              {borrowed.map((b, i) => (
                <tr key={b.sr || i}>
                  <td className="text-[var(--cyan-soft)]">
                    {String(b.sr).padStart(3, "0")}
                  </td>

                  <td className="font-display uppercase tracking-wider">
                    {b.borrower_name}
                  </td>

                  <td className="text-[var(--cyan)]">
                    #{b.dvd_id}
                  </td>

                  <td>
                    {(b.issue_date || "").toString().slice(0, 10) || "—"}
                  </td>

                  <td>
                    {b.return_date
                      ? b.return_date.toString().slice(0, 10)
                      : "—"}
                  </td>

                  <td
                    className={
                      b.fine > 0
                        ? "text-[var(--magenta)]"
                        : "text-[var(--cyan-soft)]"
                    }
                  >
                    ¥{b.fine || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}

