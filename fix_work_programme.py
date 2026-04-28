import sys

def fix_file():
    with open("src/components/AuditPlanning/WorkProgrammeSection.tsx", "r", encoding="utf-8") as f:
        content = f.read()
    
    # We want to remove the premature return block and instead insert it correctly.
    bad_string = """          return (
            <>
              {matCalc && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div className={s.card} style={{ padding: "0.75rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Overall Materiality</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#14532d", marginTop: "0.25rem" }}>{fmtCurrency(matCalc.overallMateriality)}</div>
                  </div>
                  <div className={s.card} style={{ padding: "0.75rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Performance Materiality</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#14532d", marginTop: "0.25rem" }}>{fmtCurrency(matCalc.performanceMateriality ?? 0)}</div>
                  </div>
                  <div className={s.card} style={{ padding: "0.75rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Trivial Threshold</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#14532d", marginTop: "0.25rem" }}>{fmtCurrency(matCalc.trivialMateriality ?? 0)}</div>
                  </div>
                </div>
              )}
        """
    
    content = content.replace(bad_string, "")
    
    inject_point = """          return (
            <>
              {areaKeys.map((area) => ("""
              
    good_string = """          return (
            <>
              {matCalc && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div className={s.card} style={{ padding: "0.75rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Overall Materiality</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#14532d", marginTop: "0.25rem" }}>{fmtCurrency(matCalc.overallMateriality)}</div>
                  </div>
                  <div className={s.card} style={{ padding: "0.75rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Performance Materiality</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#14532d", marginTop: "0.25rem" }}>{fmtCurrency(matCalc.performanceMateriality ?? 0)}</div>
                  </div>
                  <div className={s.card} style={{ padding: "0.75rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Trivial Threshold</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#14532d", marginTop: "0.25rem" }}>{fmtCurrency(matCalc.trivialMateriality ?? 0)}</div>
                  </div>
                </div>
              )}
              {areaKeys.map((area) => ("""
              
    content = content.replace(inject_point, good_string)
    
    with open("src/components/AuditPlanning/WorkProgrammeSection.tsx", "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Done")

fix_file()