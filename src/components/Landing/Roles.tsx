import type { Role } from "../../types/landing";

const data: Role[] = [
  {
    title: "Staff Auditor",
    desc: "Executes field audits and financial statement reviews.",
    scope: "Entry Level",
    icon: "📋",
    stripeClass: "rs-1",
  },
  {
    title: "Senior Auditor",
    desc: "Supervises audit teams and prepares final reports.",
    scope: "Mid Level",
    icon: "📈",
    stripeClass: "rs-2",
  },
  {
    title: "Audit Manager",
    desc: "Coordinates multiple audit engagements and ensures quality.",
    scope: "Senior Level",
    icon: "👥",
    stripeClass: "rs-3",
  },
  {
    title: "Director",
    desc: "Strategic oversight and policy formulation for the AG.",
    scope: "Executive Level",
    icon: "🏛️",
    stripeClass: "rs-4",
  },
];

const Roles: React.FC = () => {
  return (
    <section className="section roles-section" id="roles">
      <div className="wrap">
        <div className="roles-header rv">
          <div className="label">
            <span className="label-rule"></span> CAREER PATHWAYS
          </div>
          <div className="h2">
            Professional <br />
            <em>Excellence</em>
          </div>
          <p className="body-txt">
            Join a team dedicated to upholding the financial integrity of Lagos
            State.
          </p>
        </div>

        <div className="roles-grid">
          {data.map((role, i) => (
            <div key={i} className={`role-card rv d${i + 1}`}>
              <div className={`role-stripe ${role.stripeClass}`}></div>
              <div className="role-icon">{role.icon}</div>
              <div className="role-scope">{role.scope}</div>
              <h3 className="role-title">{role.title}</h3>
              <p className="role-desc">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roles;
