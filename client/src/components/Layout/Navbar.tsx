import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import ThemeToggle from "../UI/ThemeToggle";
import { useNavigate } from "react-router-dom";
import s from "../../styles/navbar.module.css";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${s.navbar} ${scrolled ? s.scrolled : ""}`}>
      <div className={s.inner}>
        <a className={s.brand} href="/" aria-label="LASGAP Home">
          <div className={s.sealWrap}>
            <img src="/seal_lagos.png" alt="Lagos State Seal" />
          </div>
          <div className={s.brandText}>
            <span className={s.brandTitle}>
              Lagos State
              <br />
              Audit Platform
            </span>
            <span className={s.brandSub}>
              Office of the Auditor-General for Local Governments
            </span>
          </div>
        </a>

        <ul className={s.links}>
          <li>
            <a href="/#mandate" className={s.link}>
              Mandate
            </a>
          </li>
          <li>
            <a
              href="/public-regulations"
              className={s.link}
              onClick={(e) => {
                e.preventDefault();
                navigate("/public-regulations");
              }}
            >
              Regulations
            </a>
          </li>
          <li>
            <a
              href="/public-audit-procedures"
              className={s.link}
              onClick={(e) => {
                e.preventDefault();
                navigate("/public-audit-procedures");
              }}
            >
              Audit Procedures
            </a>
          </li>
        </ul>

        <div className={s.right}>
          <ThemeToggle />
          <Button
            variant="primary"
            className={s.portalBtn}
            onClick={() => navigate("/login")}
          >
            Portal Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
