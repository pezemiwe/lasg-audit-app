import React, { useRef } from "react";
import { useHeroCanvas } from "../../hooks/useHeroCanvas";
import { useReveal } from "../../hooks/useReveal";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHeroCanvas(canvasRef);
  const navigate = useNavigate();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useReveal([headlineRef, subRef, ctasRef]);

  return (
    <section
      className="hero"
      id="hero-section"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(6, 78, 59, 0.95), rgba(6, 78, 59, 0.85)), url("https://lagoshouseofassembly.gov.ng/home/wp-content/uploads/2024/08/ZW8A7322-1024x645.jpeg?q=80&w=2574&auto=format&fit=crop")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <canvas
        id="hero-canvas"
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          opacity: 0.4,
        }}
      ></canvas>
      <div className="hero-inner" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-left">
          <div
            className="hero-eyebrow"
            style={{
              borderColor: "rgba(251, 191, 36, 0.3)",
              background: "rgba(251, 191, 36, 0.1)",
              color: "#fbbf24",
            }}
          >
            <span
              className="eyebrow-line"
              style={{ background: "#fbbf24" }}
            ></span>
            <span
              className="eyebrow-pulse"
              style={{ background: "#fbbf24" }}
            ></span>
            LAGOS STATE GOVERNMENT
          </div>
          <h1
            className="hero-headline"
            ref={headlineRef}
            style={{ color: "#ffffff" }}
          >
            Transparency <br />
            <em style={{ color: "#fbbf24" }}>Driven by Data.</em>
          </h1>
          <p className="hero-sub" ref={subRef} style={{ color: "#e2e8f0" }}>
            Empowering <strong style={{ color: "#fbbf24" }}>57 Councils</strong>{" "}
            with world-class auditing infrastructure. Ensuring fiscal
            responsibility through automated oversight and real-time
            intelligence.
          </p>
          <div className="hero-ctas" ref={ctasRef}>
            <button
              className="btn-hero btn-hero-gold"
              onClick={() => navigate("/login")}
              style={{
                background: "#fbbf24",
                color: "#0f172a",
                boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
              }}
            >
              Access Audit Portal
            </button>
            <button
              className="btn-hero btn-hero-outline"
              style={{
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              Verify Clearance
            </button>
          </div>
          <div className="hero-tags">
            <span
              className="tag"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                color: "#cbd5e1",
              }}
            >
              <span
                className="tag-dot"
                style={{ background: "#fbbf24" }}
              ></span>
              Real-Time Monitoring
            </span>
            <span
              className="tag"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                color: "#cbd5e1",
              }}
            >
              <span
                className="tag-dot"
                style={{ background: "#fbbf24" }}
              ></span>
              Secure Archives
            </span>
            <span
              className="tag"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                color: "#cbd5e1",
              }}
            >
              <span
                className="tag-dot"
                style={{ background: "#fbbf24" }}
              ></span>
              AI-Powered Insights
            </span>
          </div>
        </div>

        <div className="hero-right">
          <div className="seal-frame">
            <div className="seal-orbit">
              <div className="orbit-node"></div>
            </div>
            <div className="seal-orbit-2"></div>
            <div className="seal-orbit-3"></div>
            <div className="seal-glow-bg"></div>
            <img
              src="/seal_lagos.png"
              className="seal-img"
              alt="Lagos State Seal"
            />

            <div className="float-card fc-1">
              <div className="fc-num">57</div>
              <div className="fc-lbl">Active Councils</div>
            </div>
            <div className="float-card fc-2">
              <div className="fc-num">98%</div>
              <div className="fc-lbl">Compliance</div>
            </div>
            <div className="float-card fc-3">
              <div className="fc-num">24/7</div>
              <div className="fc-lbl">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-divider">
        <span
          className="divider-line"
          style={{ background: "rgba(255, 255, 255, 0.2)" }}
        ></span>
        <span
          className="divider-text"
          style={{
            color: "#ffffff",
            letterSpacing: "0.2em",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          Unified Local Government Audit Platform
        </span>
        <span
          className="divider-line"
          style={{ background: "rgba(255, 255, 255, 0.2)" }}
        ></span>
      </div>
    </section>
  );
};

export default Hero;
