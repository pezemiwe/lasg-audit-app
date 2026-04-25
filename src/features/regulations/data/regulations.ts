export interface Regulation {
  cat: string;
  title: string;
  date: string;
  jurisdiction: string;
  desc: string;
  tags: string[];
}

export const regulationsData: Regulation[] = [
  {
    cat: "fa",
    title:
      "Constitution of the Federal Republic of Nigeria, 1999 — Section 125(2)",
    date: "May 29, 1999",
    jurisdiction: "federal",
    desc: "Establishes the mandate for State Auditor-Generals to audit all LGA accounts and report findings to the House of Assembly.",
    tags: ["Constitutional mandate", "LGA audit", "Reporting"],
  },
  {
    cat: "fa",
    title: "Public Finance Management ActSections 47-52",
    date: "Jul 12, 2007",
    jurisdiction: "federal",
    desc: "Defines financial reporting standards, consolidated revenue fund requirements, and annual accounting procedures.",
    tags: ["Financial reporting", "Revenue", "Annual accounts"],
  },
  {
    cat: "fa",
    title: "Lagos State Audit Law 2015 Sections 5-8",
    date: "Jan 15, 2015",
    jurisdiction: "lagos",
    desc: "Lagos State-specific provisions for LGA financial audits, including timelines and documentation requirements.",
    tags: ["Lagos State", "Audit timelines", "Documentation"],
  },
  {
    cat: "fa",
    title: "Treasury Circular on LGA Accounting Standards",
    date: "Mar 22, 2021",
    jurisdiction: "federal",
    desc: "Updated accounting standards for local governments, including chart of accounts and accrual basis guidelines.",
    tags: ["Accounting standards", "Chart of accounts"],
  },
  {
    cat: "pa",
    title: "Public Procurement Act 2007 — Sections 16-24",
    date: "Jun 04, 2007",
    jurisdiction: "federal",
    desc: "Establishes standards for evaluating value-for-money, programme efficiency, and effectiveness.",
    tags: ["Value for money", "Programme evaluation"],
  },
  {
    cat: "pa",
    title: "National Planning Commission Act Sections 7-12",
    date: "Dec 29, 1992",
    jurisdiction: "federal",
    desc: "Framework for assessing programme outcomes, development goals, and resource allocation efficiency.",
    tags: ["Outcomes", "Development goals"],
  },
  {
    cat: "pa",
    title: "Lagos State Performance Standards 2018",
    date: "Aug 10, 2018",
    jurisdiction: "lagos",
    desc: "Lagos-specific benchmarks for LGA performance evaluation, service delivery, and outcome measurement.",
    tags: ["Performance benchmarks", "Service delivery"],
  },
  {
    cat: "ca",
    title: "Fiscal Responsibility Act 2007 Part IV: Procurement",
    date: "Jul 12, 2007",
    jurisdiction: "federal",
    desc: "Outlines procurement compliance requirements, competitive bidding thresholds, and anti-corruption measures.",
    tags: ["Procurement", "Compliance", "Bidding"],
  },
  {
    cat: "ca",
    title: "Code of Conduct Bureau and Tribunal Act Part II",
    date: "Sep 01, 1989",
    jurisdiction: "federal",
    desc: "Defines ethical standards and conflict-of-interest rules for public officers including LGA officials.",
    tags: ["Ethics", "Public officers"],
  },
  {
    cat: "ca",
    title: "Lagos State Public Procurement Law 2019",
    date: "Feb 18, 2019",
    jurisdiction: "lagos",
    desc: "State-level procurement compliance framework applicable to all LGAs within Lagos State.",
    tags: ["Procurement law", "Lagos State"],
  },
];
