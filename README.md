# Lagos State Local Government Audit Automation Platform

A comprehensive platform designed to streamline and automate the entire audit lifecycle for Local Governments (LGAs) and Local Council Development Areas (LCDAs) in Lagos State.

## Features

- **End-to-End Audit Lifecycle Management:**
  - **Pre-Audit & Planning:** Scope Agreement, Mandates, Questionnaires, and Work Programmes.
  - **Fieldwork:** Real-time data collection and management.
  - **Post-Audit:** Review mechanisms and Report generation.
- **Role-Based Access Control (RBAC):**
  - **State Auditor General:** View and manage all 5 Zones (Ikeja, Lagos Island, Ikorodu, Badagry, Epe), including 20 LGAs and 37 LCDAs.
  - **Audit Supervisor:** Overview of assigned Zone(s) and regional reporting.
  - **Audit Lead & Team:** Manage and execute audits for specific assigned locales.
- **Public & Internal Portals:**
  - **Public Zone:** Landing Page, Regulations, AI Assistant and Public Mandate information.
  - **Internal Dashboard:** Team management, Audits, Workpapers, Document Portals, and Audit Trails.
- **Embedded AI & Automation:**
  - Dedicated AI Assistant for querying regulations and audit guidelines.
  - Intelligent document previews and messaging widgets.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, CSS Modules
- **Routing:** React Router DOM
- **State Management:** Custom Hooks & Context API, Zustand (Audit Store)
- **Icons:** Lucide React
- **Animations:** Custom animation hooks and logic (`utils/animations.ts`)
