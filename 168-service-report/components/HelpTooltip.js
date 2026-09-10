"use client";

import { useState, useEffect, useRef } from "react";

export default function HelpTooltip({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  if (!text) return null;

  return (
    <span ref={ref} className="relative inline-block no-print">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-ink/30 text-ink/40 text-[10px] leading-none align-middle ml-1 hover:border-steel hover:text-steel"
        aria-label="說明"
      >
        ?
      </button>
      {open && (
        <span className="absolute z-20 left-1/2 -translate-x-1/2 top-full mt-1.5 w-56 bg-ink text-white text-xs leading-relaxed rounded-sm px-3 py-2 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
