import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { MOCK_USERS } from "../../mock/data";
import { ClipboardList } from "lucide-react";
import s from "../../styles/pages.module.css";
import SummaryTab from "../../features/post-audit/components/SummaryTab";
import ScopeTab from "../../features/post-audit/components/ScopeTab";
import FollowUpsTab from "../../features/post-audit/components/FollowUpsTab";
import ExitConferenceTab from "../../features/post-audit/components/ExitConferenceTab";
import LessonsTab from "../../features/post-audit/components/LessonsTab";
import QualityTab from "../../features/post-audit/components/QualityTab";
import AuditSelector from "../../features/post-audit/components/AuditSelector";
import KpiRow from "../../features/post-audit/components/KpiRow";
import TabsNav from "../../features/post-audit/components/TabsNav";
import type { TabKey } from "../../features/post-audit/components/TabsNav";
import { usePostAuditForms } from "../../features/post-audit/hooks/usePostAuditForms";

interface PostAuditPageProps {
  auditId?: string;
  embedded?: boolean;
}

const PostAuditPage: React.FC<PostAuditPageProps> = ({
  auditId,
  embedded = false,
}) => {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const reports = useAuditStore((st) => st.reports);
  const followUps = useAuditStore((st) => st.followUps);
  const lessonsLearned = useAuditStore((st) => st.lessonsLearned);
  const qualityReviews = useAuditStore((st) => st.qualityReviews);
  const exitConferences = useAuditStore((st) => st.exitConferences);
  const scopeAgreements = useAuditStore((st) => st.scopeAgreements);
  const addToast = useAuditStore((st) => st.addToast);

  const isAG =
    user?.role === "STATE_AUDITOR_GENERAL" ||
    user?.role === "AUDITOR_GENERAL_FEDERATION";
  const isSupervisor = user?.role === "AUDIT_SUPERVISOR";
  const isLead = user?.role === "AUDIT_LEAD";
  const isHLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";
  const canManage = isSupervisor || isLead;

  const eligibleAudits = useMemo(() => {
    if (!user) return [];
    return audits
      .filter(() => true)
      .sort((a) => (a.status === "Completed" ? -1 : 1));
  }, [audits, user]);

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    auditId || eligibleAudits[0]?.id || "",
  );

  React.useEffect(() => {
    if (auditId) setSelectedAuditId(auditId);
  }, [auditId]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [localTab, setLocalTab] = useState<TabKey>("summary");
  const activeTab: TabKey = embedded
    ? localTab
    : (searchParams.get("tab") as TabKey) || "summary";
  const setActiveTab = useCallback(
    (key: TabKey) => {
      if (embedded) {
        setLocalTab(key);
      } else {
        setSearchParams(
          (prev) => {
            prev.set("tab", key);
            return prev;
          },
          { replace: true },
        );
      }
    },
    [embedded, setSearchParams],
  );

  const selectedAudit = audits.find((a) => a.id === selectedAuditId);
  const selectedLga = lgas.find((l) => l.id === selectedAudit?.lgaId);
  const auditScope = scopeAgreements.find(
    (sa) => sa.auditId === selectedAuditId || sa.lgaId === selectedAudit?.lgaId,
  );
  const auditReports = reports.filter((r) => r.auditId === selectedAuditId);
  const auditFollowUps = followUps.filter((f) => f.auditId === selectedAuditId);
  const auditLessons = lessonsLearned.filter(
    (l) => l.auditId === selectedAuditId,
  );
  const auditQualityReview = qualityReviews.find(
    (q) => q.auditId === selectedAuditId,
  );
  const auditExitConf = exitConferences.find(
    (c) => c.auditId === selectedAuditId,
  );
  const allFindings = auditReports.flatMap((r) => r.findings);

  const forms = usePostAuditForms({
    selectedAuditId,
    selectedLgaName: selectedLga?.name,
    userId: user?.id ?? "",
    userName: user?.name ?? "",
    allFindings,
  });

  const totalFollowUps = auditFollowUps.length;
  const verifiedCount = auditFollowUps.filter(
    (f) => f.status === "Verified",
  ).length;
  const overdueCount = auditFollowUps.filter((f) => {
    if (f.status === "Verified") return false;
    return new Date(f.targetDate) < new Date();
  }).length;
  const implementationRate =
    totalFollowUps > 0 ? Math.round((verifiedCount / totalFollowUps) * 100) : 0;

  if (!user) return null;

  if (eligibleAudits.length === 0) {
    return (
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Post-Audit Activities</h1>
        <p className={s.pageSubtitle}>
          No completed or reporting-stage audits available for post-audit
          activities.
        </p>
        <div className={s.emptyState}>
          <ClipboardList size={48} className={s.emptyIcon} />
          <h3 className={s.emptyTitle}>No Eligible Audits</h3>
          <p className={s.emptyDesc}>
            Post-audit activities become available when audits reach the
            Reporting or Completed stage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!embedded && (
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Post-Audit Activities</h1>
          <p className={s.pageSubtitle}>
            Follow-ups, exit conferences, lessons learned &amp; quality
            assurance
          </p>
        </div>
      )}

      {!embedded && (
        <AuditSelector
          selectedAuditId={selectedAuditId}
          setSelectedAuditId={setSelectedAuditId}
          eligibleAudits={eligibleAudits}
          lgas={lgas}
          selectedAudit={selectedAudit}
        />
      )}

      <KpiRow
        totalFollowUps={totalFollowUps}
        verifiedCount={verifiedCount}
        overdueCount={overdueCount}
        implementationRate={implementationRate}
      />

      <TabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "summary" && (
        <SummaryTab
          selectedAudit={selectedAudit}
          selectedLga={selectedLga}
          auditReports={auditReports}
          allFindings={allFindings}
          auditExitConf={auditExitConf}
          auditQualityReview={auditQualityReview}
          auditLessons={auditLessons}
          totalFollowUps={totalFollowUps}
          verifiedCount={verifiedCount}
          implementationRate={implementationRate}
          users={MOCK_USERS}
          addToast={addToast}
        />
      )}

      {activeTab === "scope" && (
        <ScopeTab auditScope={auditScope} users={MOCK_USERS} />
      )}

      {activeTab === "follow-ups" && (
        <FollowUpsTab
          canManage={canManage}
          isHLGA={isHLGA}
          allFindings={allFindings}
          auditFollowUps={auditFollowUps}
          showFollowUpForm={forms.showFollowUpForm}
          setShowFollowUpForm={forms.setShowFollowUpForm}
          fuFindingId={forms.fuFindingId}
          setFuFindingId={forms.setFuFindingId}
          fuResponsible={forms.fuResponsible}
          setFuResponsible={forms.setFuResponsible}
          fuTargetDate={forms.fuTargetDate}
          setFuTargetDate={forms.setFuTargetDate}
          handleAddFollowUp={forms.handleAddFollowUp}
          handleUpdateFollowUpStatus={forms.handleUpdateFollowUpStatus}
          users={MOCK_USERS}
        />
      )}

      {activeTab === "exit-conference" && (
        <ExitConferenceTab
          canManage={canManage}
          auditExitConf={auditExitConf}
          showExitForm={forms.showExitForm}
          setShowExitForm={forms.setShowExitForm}
          ecDate={forms.ecDate}
          setEcDate={forms.setEcDate}
          ecLgaRep={forms.ecLgaRep}
          setEcLgaRep={forms.setEcLgaRep}
          ecAttendees={forms.ecAttendees}
          setEcAttendees={forms.setEcAttendees}
          ecDiscussions={forms.ecDiscussions}
          setEcDiscussions={forms.setEcDiscussions}
          ecActions={forms.ecActions}
          setEcActions={forms.setEcActions}
          handleAddExitConference={forms.handleAddExitConference}
        />
      )}

      {activeTab === "lessons" && (
        <LessonsTab
          canManage={canManage}
          isHLGA={isHLGA}
          auditLessons={auditLessons}
          showLessonForm={forms.showLessonForm}
          setShowLessonForm={forms.setShowLessonForm}
          llCategory={forms.llCategory}
          setLlCategory={forms.setLlCategory}
          llImpact={forms.llImpact}
          setLlImpact={forms.setLlImpact}
          llTitle={forms.llTitle}
          setLlTitle={forms.setLlTitle}
          llDescription={forms.llDescription}
          setLlDescription={forms.setLlDescription}
          llAction={forms.llAction}
          setLlAction={forms.setLlAction}
          handleAddLesson={forms.handleAddLesson}
          users={MOCK_USERS}
        />
      )}

      {activeTab === "quality" && (
        <QualityTab
          isAG={isAG}
          isSupervisor={isSupervisor}
          auditQualityReview={auditQualityReview}
          showQualityForm={forms.showQualityForm}
          setShowQualityForm={forms.setShowQualityForm}
          qrOverall={forms.qrOverall}
          setQrOverall={forms.setQrOverall}
          qrPlanning={forms.qrPlanning}
          setQrPlanning={forms.setQrPlanning}
          qrFieldwork={forms.qrFieldwork}
          setQrFieldwork={forms.setQrFieldwork}
          qrReporting={forms.qrReporting}
          setQrReporting={forms.setQrReporting}
          qrTeam={forms.qrTeam}
          setQrTeam={forms.setQrTeam}
          qrTimeliness={forms.qrTimeliness}
          setQrTimeliness={forms.setQrTimeliness}
          qrStrengths={forms.qrStrengths}
          setQrStrengths={forms.setQrStrengths}
          qrImprovements={forms.qrImprovements}
          setQrImprovements={forms.setQrImprovements}
          handleSubmitQuality={forms.handleSubmitQuality}
          users={MOCK_USERS}
        />
      )}
    </>
  );
};

const PostAuditWrapper: React.FC<PostAuditPageProps> = (props) => (
  <PostAuditPage {...props} />
);

export default PostAuditWrapper;
