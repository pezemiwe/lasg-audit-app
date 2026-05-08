import { useEffect } from "react";

export const useCustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".cursor") as HTMLElement;
    const ring = document.querySelector(".cursor-ring") as HTMLElement;

    if (!cursor || !ring) return;

    let mouseX = -100,
      mouseY = -100;
    let ringX = -100,
      ringY = -100;
    let scale = 1;
    let ringScale = 1;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = "1";
      ring.style.opacity = "0.5";
    };

    const onMouseDown = () => {
      scale = 0.7;
      ringScale = 0.8;
    };

    const onMouseUp = () => {
      scale = 1;
      ringScale = 1;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        cursor.style.width = "40px";
        cursor.style.height = "40px";
        cursor.style.mixBlendMode = "difference";
        ring.style.width = "60px";
        ring.style.height = "60px";
        ring.style.borderColor = "transparent";
        ring.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      } else {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        cursor.style.mixBlendMode = "normal";
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "var(--gold)";
        ring.style.backgroundColor = "transparent";
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    const loop = () => {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;

      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);
};
