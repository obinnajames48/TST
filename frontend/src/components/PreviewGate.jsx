import { useEffect, useRef, useState } from "react";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const STORAGE_KEY = "tst:preview-gate:unlocked";
const EXPECTED =
  process.env.REACT_APP_PREVIEW_PASSWORD ||
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.REACT_APP_PREVIEW_PASSWORD
    : "") ||
  "";

export default function PreviewGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch (_) {
      return false;
    }
  });
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!unlocked) {
      // Lock body scroll while gate is open
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // focus the field
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        document.body.style.overflow = prev;
        clearTimeout(t);
      };
    }
  }, [unlocked]);

  if (!EXPECTED) {
    // No password configured — fail open so dev doesn't get locked out
    return children;
  }

  if (unlocked) return children;

  const onSubmit = (e) => {
    e.preventDefault();
    if (value === EXPECTED) {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch (_) {}
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password.");
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(180,224,76,0.10), transparent 55%), radial-gradient(circle at 80% 80%, rgba(167,139,250,0.12), transparent 60%), #0F0F12",
      }}
    >
      <div
        className={`w-full max-w-[420px] rounded-2xl border p-7 ${
          shake ? "animate-[shake_0.45s_ease-in-out]" : ""
        }`}
        style={{
          background: "#16161D",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(180,224,76,0.04)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "rgba(180,224,76,0.10)",
              border: "1px solid rgba(180,224,76,0.25)",
              color: "#B4E04C",
            }}
          >
            <Lock size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "#B4E04C" }}
            >
              Preview Locked
            </div>
            <div className="text-white text-base font-semibold">
              The Select Traders
            </div>
          </div>
        </div>

        <h1 className="mt-5 text-white text-[22px] leading-[1.2] font-semibold">
          Enter password to view this preview.
        </h1>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          This build is private. Ask the owner for access.
        </p>

        <form onSubmit={onSubmit} className="mt-6">
          <div
            className="relative flex items-center rounded-xl border"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: error
                ? "rgba(239,68,68,0.55)"
                : "rgba(255,255,255,0.10)",
            }}
          >
            <input
              ref={inputRef}
              type={show ? "text" : "password"}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError("");
              }}
              placeholder="Password"
              autoComplete="current-password"
              spellCheck="false"
              className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none"
              style={{ fontFamily: "inherit" }}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="px-3 text-white/40 hover:text-white/80 transition"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error ? (
            <div className="mt-2 text-xs" style={{ color: "#F87171" }}>
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-semibold transition hover:opacity-90 active:scale-[0.99]"
            style={{
              background: "#B4E04C",
              color: "#0F0F12",
            }}
          >
            Unlock preview
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </form>

        <div
          className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.16em]"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <span>v4.7</span>
          <span>tst · private build</span>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
