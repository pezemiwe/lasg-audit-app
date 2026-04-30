import React, { useRef } from "react";

const Mandate: React.FC = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section mandate" id="mandate">
      <div className="mandate-inner wrap">
        <div className="label">
          <span className="label-rule"></span> STATUTORY MANDATE
        </div>
        <div className="mandate-grid">
          <div className="mandate-quote-block rv rv-l" ref={leftRef}>
            <h2 className="mandate-quote">
              "To ensure accountability and transparency in the management of
              public funds across all Local Governments in Lagos State."
            </h2>
            <div className="mandate-cite">
              Office of the Auditor General of Lagos State
            </div>
          </div>
          <div className="mandate-pillars rv rv-r" ref={rightRef}>
            <div className="pillar">
              <div className="pillar-ico">⚖️</div>
              <div className="pillar-content">
                <h4>Financial Compliance</h4>
                <p>
                  Strict adherence to Lagos State Public Finance Management Law
                  (2011).
                </p>
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-ico">🔍</div>
              <div className="pillar-content">
                <h4>Value for Money</h4>
                <p>
                  Ensuring economy, efficiency, and effectiveness in public
                  spending.
                </p>
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-ico">🛡️</div>
              <div className="pillar-content">
                <h4>Risk Assurance</h4>
                <p>
                  Proactive identification and mitigation of fiscal risks in
                  councils.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mandate;
