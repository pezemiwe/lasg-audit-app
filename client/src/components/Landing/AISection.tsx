import React from "react";
import Button from "../UI/Button";

const AISection: React.FC = () => {
  return (
    <section className="section ai-section" id="ai">
      <div className="ai-grid-bg"></div>
      <div className="ai-glow"></div>
      <div className="wrap ai-inner">
        <div className="ai-copy rv rv-l">
          <div className="label">
            <span className="label-rule"></span> REGULATION INTELLIGENCE
          </div>
          <h2 className="h2">
            AI-Powered <em>Regulatory</em> <br />
            Assistant
          </h2>
          <p className="body-txt">
            Our AI is trained on all Lagos State audit regulations, laws, and
            standards. Query the system on any regulatory question and receive
            instant, accurate answers grounded in the official legal framework.
          </p>
          <div className="ai-points">
            <div className="ai-pt rv d1">
              <span className="ai-pt-ico">📜</span>
              <div className="ai-pt-body">
                <h5>Regulation Lookup</h5>
                <p>
                  Instantly retrieve relevant sections from the Audit Law, IPSAS
                  standards, and LGA financial regulations.
                </p>
              </div>
            </div>
            <div className="ai-pt rv d2">
              <span className="ai-pt-ico">💬</span>
              <div className="ai-pt-body">
                <h5>Natural Language Queries</h5>
                <p>
                  Ask questions in plain language — the AI responds with cited
                  regulatory references and compliance guidance.
                </p>
              </div>
            </div>
          </div>
          <Button variant="primary" style={{ marginTop: "2rem" }}>
            Explore Regulations
          </Button>
        </div>

        <div className="ai-visual rv rv-r">
          <div className="chat-mock">
            <div className="chat-bar">
              <div className="cb-dots">
                <div className="cb-dot"></div>
                <div className="cb-dot"></div>
                <div className="cb-dot"></div>
              </div>
              <span className="cb-title">LASG Regulation AI</span>
              <span className="cb-status">Active</span>
            </div>
            <div className="chat-msgs">
              <div className="cm cm-user">
                What is the deadline for LGAs to submit annual financial
                statements under the Audit Law?
              </div>
              <div className="cm cm-ai">
                <strong>Lagos State Audit Law (2015), Section 12(3):</strong>{" "}
                <br />
                All Local Government Councils shall submit their annual
                financial statements to the Auditor-General within 90 days after
                the close of the financial year.
              </div>
              <div className="cm cm-user">
                What are the requirements for a Performance Audit?
              </div>
            </div>
            <div className="chat-foot">
              <div className="chat-input">Ask about any regulation...</div>
              <div className="chat-send-btn">↑</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
