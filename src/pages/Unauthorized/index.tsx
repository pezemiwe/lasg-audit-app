import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShieldAlert, LogIn, Home } from "lucide-react";

const Unauthorized: React.FC = () => {
  const [params] = useSearchParams();
  const redirect = params.get("redirect");
  const loginTo = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : "/login";
  return (
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
        aria-labelledby="unauthorized-heading"
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
            backgroundColor: "#fffbeb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <ShieldAlert size={36} color="#b45309" />
        </div>
        <p
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#b45309",
            margin: "0",
            letterSpacing: "-0.02em",
          }}
        >
          401
        </p>
        <h1
          id="unauthorized-heading"
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0.5rem 0",
          }}
        >
          Authorization required
        </h1>
        <p
          style={{
            color: "#64748b",
            margin: "0 0 1rem",
            lineHeight: 1.6,
          }}
        >
          You do not have permission to access this page. This is a restricted
          area of the Lagos State Government Audit Platform.
        </p>
        <p
          style={{
            color: "#0f172a",
            margin: "0 0 1.75rem",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Please sign in with an authorized government account to continue.
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
            to={loginTo}
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
            <LogIn size={16} aria-hidden="true" />
            Sign in
          </Link>
          <Link
            to="/"
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
              textDecoration: "none",
            }}
          >
            <Home size={16} aria-hidden="true" />
            Home
          </Link>
        </nav>
      </section>
    </main>
  );
};

export default Unauthorized;
