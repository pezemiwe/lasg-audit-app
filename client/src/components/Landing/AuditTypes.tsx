import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { AuditType } from "../../types/landing";

const data: AuditType[] = [
  {
    title: "Statutory Audit",
    desc: "Annual financial statement verification for LGAs ensuring compliance with IPSAS standards.",
    icon: "📜",
    tags: ["Mandatory", "Annual"],
    themeClass: "tc-1",
  },
  {
    title: "Project Audit",
    desc: "Physical verification and value-for-money assessment of capital projects across the state.",
    icon: "🏗️",
    tags: ["On-Site", "Performance"],
    themeClass: "tc-2",
  },
  {
    title: "Special Investigation",
    desc: "Targeted forensic audits and inquiries into specific financial irregularities or petitions.",
    icon: "🔍",
    tags: ["Forensic", "Ad-hoc"],
    themeClass: "tc-3",
  },
];

const AuditTypes: React.FC = () => {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section audit-types-section" id="types">
      <div className="wrap">
        <div className="types-header">
          <div className="label">
            <span className="label-rule"></span> SCOPE OF OPERATIONS
          </div>
          <div className="h2 rv rv-l" ref={listRef}>
            Ensuring Integrity Across <br />
            <em>All Fiscal Activities</em>
          </div>
          <a
            href="/public-regulations"
            onClick={(e) => {
              e.preventDefault();
              navigate("/public-regulations");
            }}
            className="types-link"
          >
            View Audit Guidelines →
          </a>
        </div>
        <div className="types-grid">
          {data.map((item, i) => (
            <div
              key={i}
              className={`type-card ${item.themeClass} rv d${i + 1}`}
            >
              <div className="type-card-top">
                <span className="type-badge">CORE FUNCTION</span>
                <span className="type-icon">{item.icon}</span>
                <h3 className="type-title">{item.title}</h3>
              </div>
              <div className="type-card-body">
                <p className="type-desc">{item.desc}</p>
                <div className="type-tags">
                  {item.tags.map((tag, j) => (
                    <span key={j} className="type-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuditTypes;
