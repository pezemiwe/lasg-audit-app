import React from "react";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";

const CTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-left">
          <div className="h2">
            Ready to <em>Verify</em> <br />
            or <em>Submit</em>?
          </div>
          <p className="cta-sub-text">
            For LGAs: Access your dashboard to submit financial statements and
            respond to audit queries.
          </p>
          <Button variant="cta" onClick={() => navigate("/login")}>
            Go to Portal
          </Button>
          <Button variant="ghost" onClick={() => navigate("/documentation")}>
            View Documentation
          </Button>
        </div>
        <div className="cta-right">
          <div className="cta-right-label">Public Access</div>
          <div className="cta-notice">
            <strong>Transparency Initiative</strong>
            Citizens can now view summary audit reports and project performance
            metrics for their local government areas online.
          </div>
          <div className="cta-feature-list">
            <div className="cta-feat">
              <span className="cta-feat-check">✓</span>
              <span>View Annual Reports</span>
            </div>
            <div className="cta-feat">
              <span className="cta-feat-check">✓</span>
              <span>Track Capital Projects</span>
            </div>
            <div className="cta-feat">
              <span className="cta-feat-check">✓</span>
              <span>Report Whistleblower</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
