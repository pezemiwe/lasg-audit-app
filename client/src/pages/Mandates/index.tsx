import React, { useMemo, useState } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import MandateListView from "../../features/mandates/components/MandateListView";
import MandateCreateView from "../../features/mandates/components/MandateCreateView";
import MandateDetailView from "../../features/mandates/components/MandateDetailView";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading";
import PageSkeleton from "../../components/UI/PageSkeleton";

type View = "list" | "create" | "detail";

const MandatesPage: React.FC = () => {
  const isLoading = useSimulatedLoading(600);
  const mandates = useAuditStore((s) => s.mandates);

  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => mandates.find((m) => m.id === selectedId),
    [mandates, selectedId],
  );

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (view === "detail" && selected) {
    return (
      <MandateDetailView mandate={selected} onBack={() => setView("list")} />
    );
  }

  if (view === "create") {
    return <MandateCreateView onDone={() => setView("list")} />;
  }

  return (
    <MandateListView
      onCreate={() => setView("create")}
      onOpen={(id) => {
        setSelectedId(id);
        setView("detail");
      }}
    />
  );
};

export default MandatesPage;
