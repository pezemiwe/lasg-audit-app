import React from "react";

const Ticker: React.FC = () => {
  return (
    <div className="ticker">
      <div className="ticker-track">
        {Array(6)
          .fill("")
          .map((_, i) => (
            <div key={i} className="ticker-item">
              <span>Lagos State Government</span>
              <span className="ticker-dot"></span>
              <span>Office of the Auditor-General of Lagos State</span>
              <span className="ticker-dot"></span>
              <span>Unified Local Government Audit Platform</span>
              <span className="ticker-dot"></span>
              <span>Transparency & Accountability</span>
              <span className="ticker-dot"></span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Ticker;
