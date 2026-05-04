import { useState } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import type {
  FollowUpStatus,
  LessonCategory,
  QualityRating,
} from "../../../types";

interface Finding {
  id: string;
  title: string;
  recommendation: string;
}

interface Params {
  selectedAuditId: string;
  selectedLgaName: string | undefined;
  userId: string;
  userName: string;
  allFindings: Finding[];
}

export function usePostAuditForms(params: Params) {
  const { selectedAuditId, selectedLgaName, userId, userName, allFindings } =
    params;

  const addFollowUp = useAuditStore((st) => st.addFollowUp);
  const updateFollowUp = useAuditStore((st) => st.updateFollowUp);
  const verifyFollowUp = useAuditStore((st) => st.verifyFollowUp);
  const addLesson = useAuditStore((st) => st.addLesson);
  const addQualityReview = useAuditStore((st) => st.addQualityReview);
  const addExitConference = useAuditStore((st) => st.addExitConference);
  const logActivity = useAuditStore((st) => st.logActivity);
  const addToast = useAuditStore((st) => st.addToast);

  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [fuFindingId, setFuFindingId] = useState("");
  const [fuResponsible, setFuResponsible] = useState("");
  const [fuTargetDate, setFuTargetDate] = useState("");

  const handleAddFollowUp = () => {
    const finding = allFindings.find((f) => f.id === fuFindingId);
    if (!finding || !fuResponsible || !fuTargetDate) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Select finding, responsible party, and target date",
      });
      return;
    }
    addFollowUp({
      auditId: selectedAuditId,
      findingId: finding.id,
      findingTitle: finding.title,
      recommendation: finding.recommendation,
      responsibleParty: fuResponsible,
      targetDate: fuTargetDate,
      status: "Open",
    });
    logActivity({
      userId,
      action: "CREATE_FOLLOW_UP",
      details: `Follow-up created for: ${finding.title}`,
      entityType: "follow-up",
      entityId: selectedAuditId,
    });
    setShowFollowUpForm(false);
    setFuFindingId("");
    setFuResponsible("");
    setFuTargetDate("");
  };

  const handleUpdateFollowUpStatus = (
    id: string,
    status: FollowUpStatus,
    notes?: string,
  ) => {
    if (status === "Verified") {
      verifyFollowUp(id, userId);
    } else {
      updateFollowUp(id, {
        status,
        ...(notes ? { implementationNotes: notes } : {}),
      });
    }
    logActivity({
      userId,
      action: "UPDATE_FOLLOW_UP",
      details: `Follow-up status changed to ${status}`,
      entityType: "follow-up",
      entityId: id,
    });
  };

  const [showExitForm, setShowExitForm] = useState(false);
  const [ecDate, setEcDate] = useState("");
  const [ecAttendees, setEcAttendees] = useState("");
  const [ecDiscussions, setEcDiscussions] = useState("");
  const [ecActions, setEcActions] = useState("");
  const [ecLgaRep, setEcLgaRep] = useState("");
  const [ecAuditRep] = useState(userName);

  const handleAddExitConference = () => {
    if (
      !ecDate ||
      !ecAttendees.trim() ||
      !ecDiscussions.trim() ||
      !ecActions.trim()
    ) {
      addToast({
        type: "error",
        title: "Required",
        message: "All exit conference fields are required",
      });
      return;
    }
    addExitConference({
      auditId: selectedAuditId,
      date: ecDate,
      attendees: ecAttendees.split(",").map((a) => a.trim()),
      agendaItems: [
        "Audit Findings Review",
        "Management Responses",
        "Follow-Up Actions",
        "Timeline Agreement",
      ],
      keyDiscussions: ecDiscussions,
      agreedActions: ecActions,
      lgaRepresentative: ecLgaRep,
      auditRepresentative: ecAuditRep,
      minutesApproved: false,
      createdBy: userId,
    });
    logActivity({
      userId,
      action: "RECORD_EXIT_CONFERENCE",
      details: `Exit conference recorded for ${selectedLgaName || selectedAuditId}`,
      entityType: "exit-conference",
      entityId: selectedAuditId,
    });
    setShowExitForm(false);
  };

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [llCategory, setLlCategory] = useState<LessonCategory>(
    "Process Improvement",
  );
  const [llTitle, setLlTitle] = useState("");
  const [llDescription, setLlDescription] = useState("");
  const [llImpact, setLlImpact] = useState<"Positive" | "Negative">("Positive");
  const [llAction, setLlAction] = useState("");

  const handleAddLesson = () => {
    if (!llTitle.trim() || !llDescription.trim()) {
      addToast({
        type: "error",
        title: "Required",
        message: "Title and description are required",
      });
      return;
    }
    addLesson({
      auditId: selectedAuditId,
      category: llCategory,
      title: llTitle,
      description: llDescription,
      impact: llImpact,
      actionRequired: llAction,
      submittedBy: userId,
    });
    logActivity({
      userId,
      action: "ADD_LESSON_LEARNED",
      details: `Lesson: ${llTitle}`,
      entityType: "lesson",
      entityId: selectedAuditId,
    });
    setShowLessonForm(false);
    setLlTitle("");
    setLlDescription("");
    setLlAction("");
  };

  const [showQualityForm, setShowQualityForm] = useState(false);
  const [qrOverall, setQrOverall] = useState<QualityRating>(3);
  const [qrPlanning, setQrPlanning] = useState<QualityRating>(3);
  const [qrFieldwork, setQrFieldwork] = useState<QualityRating>(3);
  const [qrReporting, setQrReporting] = useState<QualityRating>(3);
  const [qrTeam, setQrTeam] = useState<QualityRating>(3);
  const [qrTimeliness, setQrTimeliness] = useState<QualityRating>(3);
  const [qrStrengths, setQrStrengths] = useState("");
  const [qrImprovements, setQrImprovements] = useState("");

  const handleSubmitQuality = () => {
    if (!qrStrengths.trim() || !qrImprovements.trim()) {
      addToast({
        type: "error",
        title: "Required",
        message: "Strengths and improvement areas required",
      });
      return;
    }
    addQualityReview({
      auditId: selectedAuditId,
      overallRating: qrOverall,
      planningQuality: qrPlanning,
      fieldworkQuality: qrFieldwork,
      reportingQuality: qrReporting,
      teamPerformance: qrTeam,
      timelinessRating: qrTimeliness,
      strengths: qrStrengths,
      improvements: qrImprovements,
      reviewedBy: userId,
    });
    logActivity({
      userId,
      action: "SUBMIT_QUALITY_REVIEW",
      details: `Quality review submitted: ${qrOverall}/5 overall`,
      entityType: "quality-review",
      entityId: selectedAuditId,
    });
    setShowQualityForm(false);
  };

  return {
    showFollowUpForm,
    setShowFollowUpForm,
    fuFindingId,
    setFuFindingId,
    fuResponsible,
    setFuResponsible,
    fuTargetDate,
    setFuTargetDate,
    handleAddFollowUp,
    handleUpdateFollowUpStatus,
    showExitForm,
    setShowExitForm,
    ecDate,
    setEcDate,
    ecAttendees,
    setEcAttendees,
    ecDiscussions,
    setEcDiscussions,
    ecActions,
    setEcActions,
    ecLgaRep,
    setEcLgaRep,
    handleAddExitConference,
    showLessonForm,
    setShowLessonForm,
    llCategory,
    setLlCategory,
    llTitle,
    setLlTitle,
    llDescription,
    setLlDescription,
    llImpact,
    setLlImpact,
    llAction,
    setLlAction,
    handleAddLesson,
    showQualityForm,
    setShowQualityForm,
    qrOverall,
    setQrOverall,
    qrPlanning,
    setQrPlanning,
    qrFieldwork,
    setQrFieldwork,
    qrReporting,
    setQrReporting,
    qrTeam,
    setQrTeam,
    qrTimeliness,
    setQrTimeliness,
    qrStrengths,
    setQrStrengths,
    qrImprovements,
    setQrImprovements,
    handleSubmitQuality,
  };
}
