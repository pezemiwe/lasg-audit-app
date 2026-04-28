import React from "react";
import type { Workpaper } from "../../../types";
import Badge from "./Badge";
import Card from "./Card";

const WorkpapersTab: React.FC<{ auditWorkpapers: Workpaper[] }> = ({
  auditWorkpapers,
}) => (
  <Card
    title="Working Papers Register"
    subtitle={`${auditWorkpapers.length} working papers uploaded`}
  >
    {auditWorkpapers.length > 0 ? (
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.83rem",
          }}
        >
          <thead>
            <tr style={{ background: "var(--bg)" }}>
              {[
                "Reference",
                "Title",
                "Type",
                "Uploaded By",
                "Date",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--text-3)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditWorkpapers.map((wp, i) => (
              <tr
                key={wp.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: i % 2 === 0 ? "transparent" : "var(--bg)",
                }}
              >
                <td
                  style={{
                    padding: "0.9rem 1rem",
                    fontFamily: "monospace",
                    color: "var(--primary)",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {wp.id.toUpperCase()}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1rem",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {wp.title}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1rem",
                    color: "var(--text-2)",
                  }}
                >
                  {wp.fileName}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1rem",
                    color: "var(--text-2)",
                  }}
                >
                  {wp.uploadedBy}
                </td>
                <td
                  style={{
                    padding: "0.9rem 1rem",
                    color: "var(--text-3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(wp.uploadedAt).toLocaleDateString("en-NG")}
                </td>
                <td style={{ padding: "0.9rem 1rem" }}>
                  <Badge status={wp.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-3)",
        }}
      >
        <p style={{ fontSize: "0.9rem" }}>No working papers uploaded yet.</p>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          Upload workpapers from the Workpapers section.
        </p>
      </div>
    )}
  </Card>
);

export default WorkpapersTab;
