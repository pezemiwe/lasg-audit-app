export const COI_DECLARATIONS = [
  "I have no personal, financial, or professional conflict of interest with this LGA or any of its officials.",
  "I have not provided any services or accepted any gifts from this LGA in the past 24 months.",
  "No member of my immediate family is employed by or holds a directorial position in this LGA.",
  "I am not aware of any circumstance that could impair my objectivity or independence on this engagement.",
];

export const getRoleName = (role: string) => {
  switch (role) {
    case "AUDIT_LEAD":
      return "Audit Lead";
    case "TEAM_AUDITOR":
      return "Team Auditor";
    case "AUDIT_SUPERVISOR":
      return "Audit Supervisor";
    default:
      return role;
  }
};
