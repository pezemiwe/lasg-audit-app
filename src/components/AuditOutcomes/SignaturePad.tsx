/* ==================================================================
   SignaturePad
   Lightweight canvas-based signature capture. Outputs a PNG data URL.
   No external dependencies.
   ================================================================== */

import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import type { SignatureBlock } from "../../types/auditOutcomes";

interface SignaturePadProps {
  label: string;
  role: SignatureBlock["role"];
  defaultTitle: string;
  value?: SignatureBlock;
  onChange: (signature: SignatureBlock) => void;
  disabled?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  role,
  defaultTitle,
  value,
  onChange,
  disabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(!!value?.signatureDataUrl);
  const [name, setName] = useState(value?.name || "");
  const [title, setTitle] = useState(value?.title || defaultTitle);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Prep canvas for hi-dpi
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0b1220";
    ctx.lineWidth = 1.6;

    if (value?.signatureDataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = value.signatureDataUrl;
    }
  }, [value?.signatureDataUrl]);

  const getPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const canvas = canvasRef.current!;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!drawing || disabled) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasStrokes(true);
  };

  const handleUp = () => {
    if (!drawing) return;
    setDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const handleConfirm = () => {
    if (!hasStrokes || !name.trim()) return;
    const canvas = canvasRef.current!;
    const dataUrl = canvas.toDataURL("image/png");
    onChange({
      role,
      name: name.trim(),
      title: title.trim() || defaultTitle,
      signatureDataUrl: dataUrl,
      signedAt: new Date().toISOString(),
    });
  };

  const isSigned = !!value?.signedAt;

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "1rem",
        background: isSigned ? "#f0fdf4" : "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>{label}</strong>
        {isSigned && (
          <span
            style={{
              fontSize: "0.7rem",
              color: "#15803d",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Check size={14} /> Signed {new Date(value!.signedAt!).toLocaleDateString()}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          disabled={disabled || isSigned}
          style={{
            padding: "0.45rem 0.6rem",
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            fontSize: "0.85rem",
          }}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title / position"
          disabled={disabled || isSigned}
          style={{
            padding: "0.45rem 0.6rem",
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            fontSize: "0.85rem",
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 110,
          border: "1px dashed #cbd5e1",
          borderRadius: 4,
          touchAction: "none",
          cursor: disabled || isSigned ? "not-allowed" : "crosshair",
          background: "#fafafa",
        }}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.5rem",
        }}
      >
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || isSigned || !hasStrokes}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "0.35rem 0.7rem",
            fontSize: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: 4,
            background: "#ffffff",
            cursor:
              disabled || isSigned || !hasStrokes ? "not-allowed" : "pointer",
            color: "#475569",
          }}
        >
          <RotateCcw size={12} /> Clear
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={disabled || isSigned || !hasStrokes || !name.trim()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "0.35rem 0.8rem",
            fontSize: "0.75rem",
            border: "1px solid #064e3b",
            borderRadius: 4,
            background: "#064e3b",
            color: "#ffffff",
            cursor:
              disabled || isSigned || !hasStrokes || !name.trim()
                ? "not-allowed"
                : "pointer",
          }}
        >
          <Check size={12} /> Sign
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
