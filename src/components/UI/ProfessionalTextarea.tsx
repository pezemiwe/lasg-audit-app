import React, { useRef, useState, type TextareaHTMLAttributes } from "react";
import { AlignLeft } from "lucide-react";

interface ProfessionalTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showWordCount?: boolean;
  minWords?: number;
  maxWords?: number;
}

const ProfessionalTextarea: React.FC<ProfessionalTextareaProps> = ({
  label,
  helperText,
  error,
  showWordCount = false,
  minWords,
  maxWords,
  className = "",
  value,
  onChange,
  disabled,
  placeholder,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const text = typeof value === "string" ? value : "";
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;

  const wordCountColor =
    minWords && words < minWords
      ? "#dc2626"
      : maxWords && words > maxWords
        ? "#d97706"
        : "#16a34a";

  const borderColor = error
    ? "#ef4444"
    : focused
      ? "#064e3b"
      : disabled
        ? "#e2e8f0"
        : "#cbd5e1";

  const ringColor = error
    ? "rgba(239,68,68,0.12)"
    : focused
      ? "rgba(6,78,59,0.1)"
      : "transparent";

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: focused ? "#064e3b" : "var(--text-2)",
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          <AlignLeft size={11} />
          {label}
        </label>
      )}

      <div
        style={{
          position: "relative",
          borderRadius: "10px",
          border: `1.5px solid ${borderColor}`,
          boxShadow: focused
            ? `0 0 0 3px ${ringColor}, 0 1px 4px rgba(0,0,0,0.06)`
            : "0 1px 3px rgba(0,0,0,0.04)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          background: disabled
            ? "var(--surface-2, #f8fafc)"
            : "var(--surface, #fff)",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: "2px",
            background: focused
              ? "linear-gradient(90deg, #064e3b, #10b981)"
              : error
                ? "#ef4444"
                : "transparent",
            transition: "background 0.25s",
          }}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder || "Enter your response…"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            minHeight: "180px",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            lineHeight: "1.65",
            color: "var(--text, #1e293b)",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "text",
            display: "block",
          }}
          {...props}
        />

        {/* Bottom status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.375rem 0.875rem",
            borderTop: `1px solid ${focused ? "rgba(6,78,59,0.1)" : "var(--border, #e2e8f0)"}`,
            background: focused
              ? "rgba(6,78,59,0.025)"
              : "var(--surface-2, #f8fafc)",
            transition: "background 0.2s, border-color 0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.7rem",
              color: "var(--text-3, #94a3b8)",
              fontWeight: 500,
            }}
          >
            {focused && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "inline-block",
                  animation: "pulse 1.5s infinite",
                }}
              />
            )}
            {chars > 0 && <span>{chars} chars</span>}
          </div>

          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color:
                showWordCount || minWords || maxWords
                  ? wordCountColor
                  : "var(--text-3, #94a3b8)",
            }}
          >
            {showWordCount || minWords || maxWords ? (
              <>
                {words} word{words !== 1 ? "s" : ""}
                {minWords ? ` / ${minWords} min` : ""}
                {maxWords ? ` / ${maxWords} max` : ""}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {(helperText || error) && (
        <p
          style={{
            fontSize: "0.72rem",
            color: error ? "#ef4444" : "var(--text-3, #94a3b8)",
            marginTop: "0.125rem",
            fontWeight: 500,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default ProfessionalTextarea;
