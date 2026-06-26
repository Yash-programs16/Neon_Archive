
import React, { useEffect, useRef, useState } from "react";
import { X, Minus, Square } from "lucide-react";

/**
 * Draggable XP-style window with cybercore skin.
 * Props: title, jp, onClose, onMinimize, initial { x, y, w, h }, children, z, onFocus, testid
 */
export default function XPWindow({
  title = "WINDOW",
  jp,
  onClose,
  initial = { x: 80, y: 80, w: 560, h: 420 },
  children,
  z = 50,
  onFocus = () => {},
  testid,
}) {
  const [pos, setPos] = useState({ x: initial.x, y: initial.y });
  const [size] = useState({ w: initial.w, h: initial.h });
  const drag = useRef(null);

  const onDown = (e) => {
    onFocus();

    const startX = e.clientX;
    const startY = e.clientY;
    const ox = pos.x;
    const oy = pos.y;

    drag.current = { startX, startY, ox, oy };

    const move = (ev) => {
      if (!drag.current) return;

      const dx = ev.clientX - drag.current.startX;
      const dy = ev.clientY - drag.current.startY;

      setPos({
        x: Math.max(0, drag.current.ox + dx),
        y: Math.max(0, drag.current.oy + dy),
      });
    };

    const up = () => {
      drag.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  useEffect(() => {
    // re-center if off-screen on resize
    const onResize = () => {
      setPos((p) => ({
        x: Math.min(p.x, window.innerWidth - 200),
        y: Math.min(p.y, window.innerHeight - 80),
      }));
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      data-testid={testid}
      className="xp-window absolute"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        maxWidth: "calc(100vw - 32px)",
        zIndex: z,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="xp-titlebar flex items-center justify-between px-3"
        onMouseDown={onDown}
      >
        <div className="flex items-center gap-2">
          <span className="dot" />

          <span className="font-hud text-[10px] tracking-[0.28em] text-[var(--cyan-soft)] uppercase">
            {title}
          </span>

          {jp && (
            <span className="font-jp text-[10px] text-[var(--cyan)] opacity-60">
              {jp}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            className="w-6 h-5 grid place-items-center border border-[var(--line)] text-[var(--cyan-soft)] hover:bg-[rgba(0,225,255,0.15)]"
            data-testid={`${testid}-min`}
          >
            <Minus size={10} />
          </button>

          <button
            className="w-6 h-5 grid place-items-center border border-[var(--line)] text-[var(--cyan-soft)] hover:bg-[rgba(0,225,255,0.15)]"
            data-testid={`${testid}-max`}
          >
            <Square size={9} />
          </button>

          <button
            onClick={onClose}
            className="w-6 h-5 grid place-items-center border border-[var(--line)] text-[var(--magenta)] hover:bg-[var(--magenta)] hover:text-black"
            data-testid={`${testid}-close`}
          >
            <X size={11} />
          </button>
        </div>
      </div>

      <div className="p-5 max-h-[70vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

