
import React, { useEffect, useState } from "react";
import { Panel } from "./CyberUI";
import { Search, Edit2, Trash2, RefreshCw } from "lucide-react";
import {
  getDVDs,
  searchName,
  searchDirector,
  searchGenre,
} from "../lib/api";

export default function Catalog({ onEdit, onBorrow, refreshKey }) {
  const [dvds, setDvds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("name");

  const load = async () => {
    setLoading(true);
    setErr("");

    try {
      let data;

      if (!q.trim()) {
        data = await getDVDs();
      } else if (mode === "name") {
        data = await searchName(q.trim());
      } else if (mode === "director") {
        data = await searchDirector(q.trim());
      } else {
        data = await searchGenre(q.trim());
      }

      setDvds(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(
        e?.message?.includes("Network")
          ? "BACKEND OFFLINE :: run your Go server on :8000"
          : `ERROR :: ${e?.response?.status || ""} ${e?.message || "unknown"}`
      );

      setDvds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    
  }, [refreshKey]);

  const onSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <Panel className="p-6" testid="catalog-panel">
      {/* Search Bar */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col md:flex-row gap-3 mb-5"
      >
        <div className="flex gap-1">
          {[
            ["name", "NAME"],
            ["director", "DIRECTOR"],
            ["genre", "GENRE"],
          ].map(([m, l]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`tab-btn ${mode === m ? "active" : ""}`}
              data-testid={`catalog-mode-${m}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cyan-soft)] opacity-60"
          />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`> QUERY ${mode.toUpperCase()} ...`}
            className="cyber-input pl-9"
            data-testid="catalog-search-input"
          />
        </div>

        <button
          type="submit"
          className="btn-neon"
          data-testid="catalog-search-btn"
        >
          EXECUTE
        </button>

        <button
          type="button"
          onClick={() => {
            setQ("");
            setTimeout(load, 0);
          }}
          className="btn-neon ghost"
          data-testid="catalog-reset-btn"
        >
          <RefreshCw size={12} className="inline mr-1" />
          {" "}SYNC
        </button>
      </form>

      {/* Table */}
      <div className="border border-[var(--line)] relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-[2px] shimmer" />
        )}

        <table
          className="cyber-table"
          data-testid="catalog-table"
        >
          <thead>
            <tr>
              <th>// IDX</th>
              <th>DVD_ID</th>
              <th>TITLE</th>
              <th>DIRECTOR</th>
              <th>GENRE</th>
              <th className="text-right">OPS</th>
            </tr>
          </thead>

          <tbody>
            {dvds.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <div className="font-hud text-[11px] tracking-[0.28em] text-[var(--cyan-soft)] opacity-70 uppercase">
                    {err || "NO RECORDS // INDEX EMPTY"}
                  </div>

                  <div className="font-pixel text-[var(--cyan-soft)] opacity-50 mt-2">
                    &gt;_ insert disc to populate
                  </div>
                </td>
              </tr>
            )}

            {dvds.map((d, i) => (
              <tr
                key={d.dvd_id ?? d.sr ?? i}
                data-testid={`catalog-row-${d.dvd_id}`}
              >
                <td className="text-[var(--cyan-soft)]">
                  {String(i + 1).padStart(3, "0")}
                </td>

                <td className="text-[var(--cyan)]">
                  #{d.dvd_id}
                </td>

                <td className="font-display uppercase tracking-wider text-[var(--bone)]">
                  {d.dvd_name}
                </td>

                <td>{d.director}</td>

                <td>
                  <span className="px-2 py-[2px] border border-[var(--line)] text-[var(--cyan-soft)] text-[10px] tracking-[0.2em] uppercase">
                    {d.genre}
                  </span>
                </td>

                <td className="text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onBorrow(d)}
                      className="btn-neon ghost !py-1.5 !px-3 !text-[10px]"
                      data-testid={`catalog-borrow-${d.dvd_id}`}
                    >
                      BORROW
                    </button>

                    <button
                      onClick={() => onEdit(d)}
                      className="btn-neon ghost !py-1.5 !px-3 !text-[10px]"
                      data-testid={`catalog-edit-${d.dvd_id}`}
                    >
                      <Edit2
                        size={11}
                        className="inline mr-1"
                      />
                      {" "}EDIT
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between font-hud text-[10px] tracking-[0.28em] text-[var(--cyan-soft)] opacity-70 uppercase">
        <div>
          RECORDS :: {String(dvds.length).padStart(4, "0")}
        </div>

        <div>
          DATA SYNC :: {loading ? "PENDING" : "STABLE"}
        </div>
      </div>
    </Panel>
  );
}

