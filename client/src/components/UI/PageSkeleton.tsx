import React from "react";

const PageSkeleton: React.FC = () => {
  return (
    <div style={{ padding: "24px", width: "100%" }}>
      {/* Header Skeleton */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <div
            className="animate-pulse bg-slate-200 rounded"
            style={{ height: "32px", width: "250px", marginBottom: "8px" }}
          />
          <div
            className="animate-pulse bg-slate-200 rounded"
            style={{ height: "16px", width: "150px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            className="animate-pulse bg-slate-200 rounded"
            style={{ height: "40px", width: "100px" }}
          />
          <div
            className="animate-pulse bg-slate-200 rounded"
            style={{ height: "40px", width: "100px" }}
          />
        </div>
      </div>

      {/* Stats/Cards row */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
        {[1, 2, 3, 4].map((k) => (
          <div
            key={k}
            className="animate-pulse bg-slate-100 rounded shadow-sm border border-slate-200"
            style={{ flex: 1, height: "120px", padding: "16px" }}
          >
            <div
              className="animate-pulse bg-slate-200 rounded"
              style={{ height: "16px", width: "60%", marginBottom: "16px" }}
            />
            <div
              className="animate-pulse bg-slate-200 rounded"
              style={{ height: "32px", width: "40%" }}
            />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div
        className="animate-pulse bg-slate-100 rounded shadow-sm border border-slate-200"
        style={{ height: "400px", width: "100%", padding: "24px" }}
      >
        <div
          className="animate-pulse bg-slate-200 rounded"
          style={{ height: "24px", width: "200px", marginBottom: "24px" }}
        />
        {[1, 2, 3, 4, 5].map((k) => (
          <div
            key={k}
            className="animate-pulse bg-slate-200 rounded"
            style={{ height: "40px", width: "100%", marginBottom: "16px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
