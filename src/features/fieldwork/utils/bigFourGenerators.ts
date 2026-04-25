/**
 * Auto-generated work-performed narratives for each ISA procedure type.
 * Pure functions — no side effects, no React. Called from BigFourAutomationPanel.
 */

export interface ControlInputs {
  activity: string;
  method: string;
  effectiveness: string;
  deviations: string;
  weakness: string;
}

export interface AnalyticalInputs {
  subject: string;
  expected: number;
  actual: number;
  basis: string;
  explanation: string;
}

export interface InquiryInputs {
  person: string;
  date: string;
  question: string;
  response: string;
  evidence: string;
}

export interface ObservationInputs {
  process: string;
  datetime: string;
  person: string;
  deviation: string;
  description: string;
}

export interface InspectionInputs {
  item: string;
  source: string;
  sample: string;
  exceptions: string;
}

export interface SubstantiveInputs {
  population: string;
  sample: string;
  method: string;
  errors: number;
  projected: number;
}

export interface GeneratedResult {
  workPerformed: string;
  raisesException: boolean;
}

export const generateControlWP = (i: ControlInputs): GeneratedResult => {
  const eff = i.effectiveness || "not assessed";
  const method = i.method || "N/A";
  const activity = i.activity || "the control activity";
  const dev = i.deviations || "None identified.";
  const weak = i.weakness || "No material weaknesses noted.";
  const raisesException =
    eff.includes("Not Operating") || eff.includes("Significant");
  return {
    workPerformed:
      `TEST OF CONTROLS — ${activity}\n\n` +
      `Test Method: ${method}\n` +
      `Sample reviewed per ISA 330 requirements.\n\n` +
      `FINDINGS:\n` +
      `• Deviations: ${dev}\n` +
      `• Control Assessment: ${eff}\n` +
      `• Control Weakness: ${weak}\n\n` +
      `CONCLUSION:\n` +
      `Based on the test results, the control is assessed as "${eff}". ` +
      (raisesException
        ? "Substantive procedures have been extended accordingly."
        : "We can place reliance on this control for substantive testing purposes."),
    raisesException,
  };
};

export const generateAnalyticalWP = (i: AnalyticalInputs): GeneratedResult => {
  const variance = i.actual - i.expected;
  const variancePct =
    i.expected !== 0 ? Math.abs(variance / i.expected) * 100 : 0;
  const subject = i.subject || "the account";
  const basis = i.basis || "prior year comparatives";
  const explanation = i.explanation || "No management explanation provided.";
  const raisesException = variancePct > 10;
  return {
    workPerformed:
      `ANALYTICAL PROCEDURE — ${subject}\n\n` +
      `Basis of Expectation: ${basis}\n` +
      `Expected Amount: ₦${i.expected.toLocaleString()}\n` +
      `Actual Amount: ₦${i.actual.toLocaleString()}\n` +
      `Variance: ₦${variance.toLocaleString()} (${variancePct.toFixed(1)}%)\n\n` +
      `ANALYSIS:\n` +
      (raisesException
        ? `The variance of ${variancePct.toFixed(1)}% exceeds our materiality threshold of 10% and requires further investigation.\n`
        : `The variance of ${variancePct.toFixed(1)}% is within acceptable limits.\n`) +
      `\nManagement Explanation: ${explanation}\n\n` +
      `CONCLUSION:\n` +
      (raisesException
        ? "An unexplained material variance has been identified. The matter has been escalated for further substantive testing per ISA 520."
        : "The analytical procedure confirms the account balance is consistent with our expectation. No further procedures required."),
    raisesException,
  };
};

export const generateInquiryWP = (i: InquiryInputs): GeneratedResult => {
  const person = i.person || "management representative";
  const date = i.date || "date not recorded";
  const question = i.question || "[Question not documented]";
  const response = i.response || "[Response not documented]";
  const evidence = i.evidence || "No corroborating evidence obtained.";
  return {
    workPerformed:
      `INQUIRY PROCEDURE (ISA 500)\n\n` +
      `Person Inquired: ${person}\nDate: ${date}\n\n` +
      `ENQUIRY:\n${question}\n\n` +
      `RESPONSE OBTAINED:\n${response}\n\n` +
      `CORROBORATION:\n${evidence}\n\n` +
      `CONCLUSION:\nThe inquiry has been documented per ISA 500. The response has been ` +
      (evidence.toLowerCase().includes("no corrobor")
        ? "noted but not corroborated with independent evidence. Further procedures may be required."
        : "corroborated with independent evidence and is considered reliable for audit purposes."),
    raisesException: false,
  };
};

export const generateObservationWP = (
  i: ObservationInputs,
): GeneratedResult => {
  const process = i.process || "the process";
  const dt = i.datetime || "date/time not recorded";
  const person = i.person || "staff members";
  const deviation = i.deviation || "Not assessed";
  const desc = i.description || "[No description provided]";
  const raisesException = deviation.toLowerCase().includes("significant");
  return {
    workPerformed:
      `OBSERVATION (ISA 500)\n\n` +
      `Process Observed: ${process}\nDate/Time: ${dt}\nPerformed By: ${person}\n\n` +
      `OBSERVATION NOTES:\n${desc}\n\n` +
      `DEVIATION ASSESSMENT:\n${deviation}\n\n` +
      `CONCLUSION:\nThe observation has been documented per ISA 500 requirements. ` +
      (raisesException
        ? "Significant deviations were noted. Reliance on this procedure is limited and additional testing has been performed."
        : "The procedure was observed to be performed consistently with the entity's stated policies."),
    raisesException,
  };
};

export const generateInspectionWP = (i: InspectionInputs): GeneratedResult => {
  const item = i.item || "documents";
  const source = i.source || "the entity";
  const sample = i.sample || "N/A";
  const exceptions = i.exceptions || "None identified.";
  const raisesException =
    exceptions.toLowerCase() !== "none identified." &&
    exceptions.trim().length > 0;
  return {
    workPerformed:
      `INSPECTION (ISA 500)\n\n` +
      `Item Inspected: ${item}\nSource: ${source}\nSample Size: ${sample}\n\n` +
      `INSPECTION FINDINGS:\n${exceptions}\n\n` +
      `CONCLUSION:\n` +
      (raisesException
        ? `Exceptions were identified during inspection of ${item}. These have been escalated as audit exceptions and supporting documentation has been flagged for management response.`
        : `Inspection of ${sample} items from ${source} revealed no exceptions. All sampled items were properly authorised, supported, and in compliance with applicable regulations.`),
    raisesException,
  };
};

export const generateSubstantiveWP = (
  i: SubstantiveInputs,
): GeneratedResult => {
  const population = i.population || "the population";
  const sample = i.sample || "N/A";
  const method = i.method || "judgmental selection";
  const raisesException = i.projected > 0;
  return {
    workPerformed:
      `SUBSTANTIVE TESTING (ISA 330)\n\n` +
      `Population: ${population}\nSample Size: ${sample}\nSampling Method: ${method}\n\n` +
      `TESTING RESULTS:\n` +
      `• Errors in Sample: ₦${i.errors.toLocaleString()}\n` +
      `• Projected Misstatement: ₦${i.projected.toLocaleString()}\n\n` +
      `CONCLUSION:\n` +
      (raisesException
        ? `A projected misstatement of ₦${i.projected.toLocaleString()} was identified. This exceeds/approaches performance materiality and has been reported as an audit exception. Management has been requested to investigate and provide adjustments.`
        : `No material misstatements were identified in the sample tested. Based on our sampling methodology, we conclude that the ${population} is not materially misstated.`),
    raisesException,
  };
};
