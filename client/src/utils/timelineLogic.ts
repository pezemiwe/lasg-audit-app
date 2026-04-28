import type { Audit, Notification, User } from "../types";
import { LGAS, MOCK_USERS } from "../mock/data";

// Helper to find supervisor for an audit
const findSupervisorForAudit = (audit: Audit): User | undefined => {
  const lga = LGAS.find((l) => l.id === audit.lgaId);
  if (!lga) return undefined;

  // Find a supervisor assigned to this zone
  return MOCK_USERS.find(
    (u) => u.role === "AUDIT_SUPERVISOR" && u.zoneId === lga.zoneId,
  );
};

export const checkDeadlinesAndGenerateNotifications = (
  audits: Audit[],
  existingNotifications: Notification[],
): Notification[] => {
  const newNotifications: Notification[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day for consistent calculations

  // We'll use a simple "notification key" mechanism to avoid duplicates
  // Key = `${auditId}-${phase}-${type}-${dateString}`
  // But since we can't store keys on the notification object easily without extending it,
  // we'll just check if a notification with the same title/message/recipient exists recently.

  // Since this runs on client side, we might spam if we don't check "isRead" or similar.
  // For this demo, we will check if a notification with the SAME MESSAGE exists for the user.

  const notificationExists = (userId: string, message: string) => {
    return (
      existingNotifications.some(
        (n) => n.userId === userId && n.message === message,
      ) ||
      newNotifications.some((n) => n.userId === userId && n.message === message)
    );
  };

  audits.forEach((audit) => {
    if (!audit.phaseTimelines) return;

    Object.entries(audit.phaseTimelines).forEach(([phase, timeline]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = timeline as any;
      if (!t.endDate) return;

      const endDate = new Date(t.endDate);
      const daysRemaining = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (audit.status !== phase) return; // Only check deadlines for the ACTIVE phase

      // 1. WARNING: 3 Days before deadline
      if (daysRemaining <= 3 && daysRemaining > 0) {
        const message = `Reminder: The ${phase} phase for ${audit.id} is due in ${daysRemaining} days (${t.endDate}).`;

        // Notify Team
        if (audit.teamIds) {
          audit.teamIds.forEach((memberId) => {
            if (!notificationExists(memberId, message)) {
              newNotifications.push({
                id: `notif-${Date.now()}-${memberId}-${audit.id}`,
                userId: memberId,
                title: "Approaching Deadline",
                message,
                type: "warning",
                isRead: false,
                timestamp: new Date().toISOString(),
                relatedEntityId: audit.id,
                relatedEntityType: "audit",
              });
            }
          });
        }

        // Notify Lead
        if (audit.leadId && !notificationExists(audit.leadId, message)) {
          newNotifications.push({
            id: `notif-${Date.now()}-${audit.leadId}-${audit.id}`,
            userId: audit.leadId,
            title: "Approaching Deadline",
            message,
            type: "warning",
            isRead: false,
            timestamp: new Date().toISOString(),
            relatedEntityId: audit.id,
            relatedEntityType: "audit",
          });
        }
      }

      // 2. ESCALATION: Deadline Missed
      if (daysRemaining < 0) {
        const overdueDays = Math.abs(daysRemaining);
        const message = `ESCALATION: The ${phase} phase for ${audit.id} is OVERDUE by ${overdueDays} days. Immediate action required.`;

        // Notify Lead (Escalation)
        if (audit.leadId && !notificationExists(audit.leadId, message)) {
          newNotifications.push({
            id: `esc-lead-${Date.now()}-${audit.leadId}`,
            userId: audit.leadId,
            title: "Phase Overdue - Escalation",
            message,
            type: "error",
            isRead: false,
            timestamp: new Date().toISOString(),
            relatedEntityId: audit.id,
            relatedEntityType: "audit",
          });
        }

        // Notify Supervisor (Escalation)
        const supervisor = findSupervisorForAudit(audit);
        if (supervisor && !notificationExists(supervisor.id, message)) {
          newNotifications.push({
            id: `esc-sup-${Date.now()}-${supervisor.id}`,
            userId: supervisor.id,
            title: "Escalation: Audit Phase Overdue",
            message: `Audit ${audit.id} (${phase}) is overdue. Lead: ${audit.leadId}.`,
            type: "error",
            isRead: false,
            timestamp: new Date().toISOString(),
            relatedEntityId: audit.id,
            relatedEntityType: "audit",
          });
        }
      }
    });

    // Check Mandate Level Timelines (if any, usually just Start/End of whole mandate)
    // We can assume Mandate deadlines are checked similarly if needed.
  });

  return newNotifications;
};
