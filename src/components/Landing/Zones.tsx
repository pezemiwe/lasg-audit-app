import React from "react";
import type { Zone } from "../../types/landing";

const zones: Zone[] = [
  {
    name: "Ikeja Division",
    lgas: "Agege, Alimosho, Ifako-Ijaiye, Ikeja, Kosofe, Mushin, Oshodi-Isolo, Somolu + 15 LCDAs",
    count: 23,
    themeClass: "zd-1",
  },
  {
    name: "Lagos Division",
    lgas: "Lagos Island, Lagos Mainland, Apapa, Surulere, Eti-Osa + 7 LCDAs",
    count: 12,
    themeClass: "zd-2",
  },
  {
    name: "Ikorodu Division",
    lgas: "Ikorodu + 5 LCDAs",
    count: 6,
    themeClass: "zd-3",
  },
  {
    name: "Badagry Division",
    lgas: "Ajeromi-Ifelodun, Amuwo-Odofin, Ojo, Badagry + 6 LCDAs",
    count: 10,
    themeClass: "zd-4",
  },
  {
    name: "Epe Division",
    lgas: "Epe, Ibeju-Lekki + 4 LCDAs",
    count: 6,
    themeClass: "zd-5",
  },
];

const Zones: React.FC = () => {
  return (
    <section className="section zones-section" id="zones">
      <div className="wrap zones-grid">
        <div className="zones-copy rv rv-l">
          <div className="label">
            <span className="label-rule"></span> GEOGRAPHICAL COVERAGE
          </div>
          <div className="h2">
            Comprehensive <br />
            <em>Statewide Reach</em>
          </div>
          <p className="body-txt">
            Our audit network spans across all 5 administrative divisions,
            ensuring every council maintains the highest fiscal standards.
          </p>
          <div className="flow-chain">
            <div className="fc-step rv d1">
              <div className="fc-n">1</div>
              <div className="fc-body">
                <h5>Audit Planning</h5>
                <p>
                  Risk assessment and scheduling based on previous year's data.
                </p>
              </div>
            </div>
            <div className="fc-step rv d2">
              <div className="fc-n">2</div>
              <div className="fc-body">
                <h5>Field Execution</h5>
                <p>On-site verification of records and physical projects.</p>
              </div>
            </div>
            <div className="fc-step rv d3">
              <div className="fc-n">3</div>
              <div className="fc-body">
                <h5>Reporting</h5>
                <p>Submission of findings to the Public Accounts Committee.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="zones-list rv rv-r">
          <div className="zones-stack">
            {zones.map((zone, i) => (
              <div key={i} className="zone-row">
                <div className={`zone-dot ${zone.themeClass}`}>
                  <span>{zone.name.charAt(0)}</span>
                </div>
                <div className="zone-info">
                  <h4 className="zone-name">{zone.name}</h4>
                  <p className="zone-lgas-txt">{zone.lgas}</p>
                </div>
                <div className="zone-count-pill">{zone.count} Councils</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Zones;
