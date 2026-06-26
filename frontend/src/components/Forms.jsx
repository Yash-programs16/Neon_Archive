import React, { useState } from "react";
import {
  addDVD,
  updateDVD,
  deleteDVD,
  borrowDVD,
  returnDVD,
} from "../lib/api";

// Add this default component
export default function Forms() {
  return (
    <div className="space-y-8">
      <DvdForm />
      <BorrowForm />
      <ReturnForm />
    </div>
  );
}

// ---------------- Field ----------------

const Field = ({ label, name, value, onChange, type = "text", testid }) => (
  <label className="block">
    <div className="font-hud text-[10px] tracking-[0.3em] text-[var(--cyan-soft)] uppercase mb-2 opacity-80">
      {label}
    </div>
    <input
      data-testid={testid}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="cyber-input"
      autoComplete="off"
    />
  </label>
);

// Keep the rest of your file exactly the same...

const Status = ({ msg, ok }) => {
  if (!msg) return null;
  return (
    <div
      className={`font-hud text-[10px] tracking-[0.28em] uppercase border px-3 py-2 mt-2 ${
        ok
          ? "border-[var(--line)] text-[var(--cyan)]"
          : "border-[rgba(255,60,245,0.4)] text-[var(--magenta)]"
      }`}
    >
      {ok ? ">_ " : "!! "} {msg}
    </div>
  );
};

export function DvdForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial;

  const [f, setF] = useState({
    dvd_id: initial?.dvd_id || "",
    dvd_name: initial?.dvd_name || "",
    director: initial?.director || "",
    genre: initial?.genre || "",
  });

  const [msg, setMsg] = useState(null);

  const set = (e) =>
    setF({
      ...f,
      [e.target.name]: e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const payload = {
        dvd_id: Number(f.dvd_id),
        dvd_name: f.dvd_name,
        director: f.director,
        genre: f.genre,
      };

      if (isEdit) {
        await updateDVD(initial.dvd_id, payload);
      } else {
        await addDVD(payload);
      }

      setMsg({
        ok: true,
        text: isEdit ? "RECORD UPDATED" : "DISC INSERTED",
      });

      setTimeout(() => {
        onSaved?.();
        onClose?.();
      }, 600);
    } catch (e) {
      setMsg({
        ok: false,
        text: e?.response?.data || e?.message || "OPERATION FAILED",
      });
    }
  };

  const remove = async () => {
    if (!isEdit) return;

    if (!window.confirm("PURGE RECORD ?")) return;

    try {
      await deleteDVD(initial.dvd_id);

      setMsg({
        ok: true,
        text: "RECORD PURGED",
      });

      setTimeout(() => {
        onSaved?.();
        onClose?.();
      }, 600);
    } catch (e) {
      setMsg({
        ok: false,
        text: e?.message || "PURGE FAILED",
      });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="font-jp text-[10px] tracking-[0.3em] text-[var(--cyan)] opacity-70">
        {isEdit ? "編集モード // EDIT MODE" : "新規挿入 // INSERT DISC"}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="DVD_ID"
          name="dvd_id"
          value={f.dvd_id}
          onChange={set}
          type="number"
          testid="form-dvd-id"
        />

        <Field
          label="GENRE"
          name="genre"
          value={f.genre}
          onChange={set}
          testid="form-genre"
        />
      </div>

      <Field
        label="TITLE // 作品名"
        name="dvd_name"
        value={f.dvd_name}
        onChange={set}
        testid="form-dvd-name"
      />

      <Field
        label="DIRECTOR // 監督"
        name="director"
        value={f.director}
        onChange={set}
        testid="form-director"
      />

      <Status msg={msg?.text} ok={msg?.ok} />

      <div className="flex items-center gap-3 pt-2">
        <button className="btn-neon" data-testid="form-submit">
          {isEdit ? "COMMIT" : "INSERT DISC"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={remove}
            className="btn-neon magenta"
            data-testid="form-delete"
          >
            PURGE
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="btn-neon ghost"
          data-testid="form-cancel"
        >
          ABORT
        </button>
      </div>
    </form>
  );
}

export function BorrowForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState({
    borrower_name: "",
    dvd_id: initial?.dvd_id || "",
    issue_date: new Date().toISOString().slice(0, 10),
  });

  const [msg, setMsg] = useState(null);

  const set = (e) =>
    setF({
      ...f,
      [e.target.name]: e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      await borrowDVD({
        borrower_name: f.borrower_name,
        dvd_id: Number(f.dvd_id),
        issue_date: new Date(f.issue_date).toISOString(),
      });

      setMsg({
        ok: true,
        text: "BORROW LOGGED",
      });

      setTimeout(() => {
        onSaved?.();
        onClose?.();
      }, 600);
    } catch (e) {
      setMsg({
        ok: false,
        text: e?.response?.data || e?.message || "OPERATION FAILED",
      });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="font-jp text-[10px] tracking-[0.3em] text-[var(--cyan)] opacity-70">
        貸出ログ // BORROW LOG
      </div>

      <Field
        label="BORROWER // 利用者"
        name="borrower_name"
        value={f.borrower_name}
        onChange={set}
        testid="borrow-name"
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="DVD_ID"
          name="dvd_id"
          value={f.dvd_id}
          onChange={set}
          type="number"
          testid="borrow-id"
        />

        <Field
          label="ISSUE DATE"
          name="issue_date"
          value={f.issue_date}
          onChange={set}
          type="date"
          testid="borrow-date"
        />
      </div>

      <Status msg={msg?.text} ok={msg?.ok} />

      <div className="flex items-center gap-3 pt-2">
        <button className="btn-neon" data-testid="borrow-submit">
          CHECKOUT
        </button>

        <button
          type="button"
          onClick={onClose}
          className="btn-neon ghost"
          data-testid="borrow-cancel"
        >
          ABORT
        </button>
      </div>
    </form>
  );
}

export function ReturnForm({ onClose, onSaved }) {
  const [id, setId] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      await returnDVD(Number(id));

      setMsg({
        ok: true,
        text: "DISC RETURNED",
      });

      setTimeout(() => {
        onSaved?.();
        onClose?.();
      }, 600);
    } catch (e) {
      setMsg({
        ok: false,
        text: e?.response?.data || e?.message || "RETURN FAILED",
      });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="font-jp text-[10px] tracking-[0.3em] text-[var(--cyan)] opacity-70">
        返却処理 // RETURN PROTOCOL
      </div>

      <Field
        label="BORROW_ID // SR"
        name="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
        type="number"
        testid="return-id"
      />

      <Status msg={msg?.text} ok={msg?.ok} />

      <div className="flex items-center gap-3 pt-2">
        <button className="btn-neon" data-testid="return-submit">
          RETURN
        </button>

        <button
          type="button"
          onClick={onClose}
          className="btn-neon ghost"
          data-testid="return-cancel"
        >
          ABORT
        </button>
      </div>
    </form>
  );
}