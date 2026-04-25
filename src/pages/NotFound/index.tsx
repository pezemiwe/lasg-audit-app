import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => (
  <main
    role="main"
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundColor: "#f8fafc",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}
  >
    <section
      aria-labelledby="not-found-heading"
      style={{
        maxWidth: "560px",
        width: "100%",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "2.5rem",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "#ecfdf5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem",
        }}
      >
        <FileQuestion size={36} color="#064e3b" />
      </div>
      <p
        style={{
          fontSize: "3rem",
          fontWeight: 800,
          color: "#064e3b",
          margin: "0",
          letterSpacing: "-0.02em",
        }}
      >
        404
      </p>
      <h1
        id="not-found-heading"
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0.5rem 0",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          color: "#64748b",
          margin: "0 0 1.75rem",
          lineHeight: 1.6,
        }}
      >
        The page you are looking for does not exist or may have been moved.
      </p>
      <nav
        aria-label="Recovery actions"
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.65rem 1.25rem",
            borderRadius: "8px",
            border: "1px solid #064e3b",
            backgroundColor: "#064e3b",
            color: "#ffffff",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Home size={16} aria-hidden="true" />
          Home
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.65rem 1.25rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#ffffff",
            color: "#0f172a",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Go back
        </button>
      </nav>
    </section>
  </main>
);

export default NotFound;
