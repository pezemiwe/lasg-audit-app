# Lagos State Local Government Audit Automation Platform (RBAC Demo)

This is a Role-Based Access Control (RBAC) demonstration for the user journeys outlined in the Lagos State Audit Platform requirements.

## Features
- **Public Zone**: Landing Page, Regulations (with mocked AI assistant).
- **Authentication**: Simulated login for active roles.
- **RBAC**: 
    - **State Auditor General**: View all 5 Zones (Ikeja, Lagos Island, Ikorodu, Badagry, Epe).
    - **Audit Supervisor**: View assigned Zone.
    - **Audit Lead**: View assigned LGA.
- **Mock Data**: Includes 20 LGAs properly mapped to 5 Zones.

## Getting Started

1. Install dependencies:
   `ash
   npm install
   ` 
2. Run the development server:
   `ash
   npm run dev
   ` 

## Tech Stack
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React (Icons)
