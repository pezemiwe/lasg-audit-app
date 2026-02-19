import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer-wrap">
      <div className="footer-inner wrap">
        <div className="footer-top">
          <div className="f-brand">
            <div className="f-logo">
              <div className="f-seal">
                <img src="/seal_lagos.png" alt="Seal" />
              </div>
              <div className="f-titles">
                <h3 className="f-name">Lagos State</h3>
                <div className="f-dept">Audit Platform</div>
              </div>
            </div>
            <p className="f-tagline">
              Ensuring transparency, accountability, and value for money across
              all local governments.
            </p>
          </div>

          <div className="f-col">
            <h4>Platform</h4>
            <ul className="f-links">
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="#">Audit Status</Link>
              </li>
              <li>
                <Link to="#">Verify Clearance</Link>
              </li>
              <li>
                <Link to="#">Documentation</Link>
              </li>
            </ul>
          </div>

          <div className="f-col">
            <h4>Resources</h4>
            <ul className="f-links">
              <li>
                <Link to="/public-regulations">Legal Framework</Link>
              </li>
              <li>
                <Link to="/public-regulations">IPSAS Guidelines</Link>
              </li>
              <li>
                <Link to="#">Publication</Link>
              </li>
              <li>
                <Link to="#">Support</Link>
              </li>
            </ul>
          </div>

          <div className="f-col">
            <h4>Contact</h4>
            <ul className="f-links">
              <li>
                <a href="#">Secratariat, Ikeja</a>
              </li>
              <li>
                <a href="mailto:audit@lagosstate.gov.ng">
                  audit@lagosstate.gov.ng
                </a>
              </li>
              <li>
                <a href="tel:+2341234567890">+234 123 456 7890</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bot">
          <div className="f-copy">
            &copy; {new Date().getFullYear()} Lagos State Government. All rights
            reserved.
          </div>
          <div className="f-tagstrip">
            <span>Powered by Deloitte</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
