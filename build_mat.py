import sys

# Read source file
lines = open(r'c:\Users\pezemiwe\Documents\lasg-audit-platform\src\pages\Audit\EngagementExtended.tsx', 'r', encoding='utf-8').readlines()

# We need:
# 1. Imports header (custom - only what materiality needs)
# 2. Types + MOCK_FS + MOCK_TB + SECTION_ORDER + SECTION_LABELS + fmt + fmtPct (lines 8-764, 0-indexed: 7-763)
# 3. EngagementMaterialityContent component (lines 1758-end, 0-indexed: 1757-end)

header = '''/**
 * MaterialityAssessment.tsx
 * Materiality Assessment & Item Selection
 * ISA 320 compliant
 * Lagos State Audit Platform
 */
import React, { useState } from "react";
import {
  Target,
  Info,
  Layers,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import s from "../../styles/pages.module.css";

'''

# types + data + helpers  (lines 24 to 764 in 1-indexed = index 23 to 763)
data_section = ''.join(lines[23:764])

# materiality component (lines 1759 to end = index 1758 to end)
component = ''.join(lines[1758:])

# rename the export
component = component.replace(
    'export const EngagementMaterialityContent: React.FC = () => {',
    'export const MaterialityAssessment: React.FC = () => {'
)

full_content = header + data_section + '\n' + component

open(r'c:\Users\pezemiwe\Documents\lasg-audit-platform\src\pages\AuditPlanning\MaterialityAssessment.tsx', 'w', encoding='utf-8').write(full_content)
print('Done! Lines:', len(full_content.splitlines()))
