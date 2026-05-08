export interface Stat {
  value: string;
  label: string;
  sub: string;
  suffix?: string;
}

export interface AuditType {
  title: string;
  desc: string;
  icon: string;
  tags: string[];
  themeClass: string;
}

export interface Zone {
  name: string;
  lgas: string[];
  lcdas: string[];
  count: number;
  themeClass: string;
}

export interface Role {
  title: string;
  desc: string;
  scope: string;
  icon: string;
  stripeClass: string;
}

export interface MandatePillar {
  title: string;
  desc: string;
  icon: string;
}
