# CampusFlow AI - Intelligent Campus Services & Queue Orchestrator

CampusFlow AI is an AI-driven campus service discovery, transparent queue wait estimator, emergency priority reservation system, and digital request tracking application.

## Recovered & Recreated Project Architecture

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Dark Glassmorphism CSS design system
- **Icons**: Lucide React
- **Effects**: Canvas Confetti (ticket issuance celebrations)
- **Data Layer**: Service abstraction layer with LocalStorage persistence and optional REST API integration (`VITE_API_BASE_URL`).

---

## Getting Started Locally

### Prerequisites
- Node.js v18+ or v20+ / v22+
- npm or yarn or pnpm

### Installation
```bash
# Navigate to project directory
cd C:\Users\sunny\.gemini\antigravity\scratch\campusflow-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at:
`http://localhost:5173/`

### Build for Production
```bash
npm run build
```

---

## AWS Cloud Hackathon Migration Architecture Suggestions

To adapt CampusFlow AI into an enterprise AWS Cloud architecture for your hackathon:

1. **Frontend Hosting**: AWS Amplify Hosting or S3 Static Website + Amazon CloudFront CDN.
2. **API & Serverless**: AWS API Gateway + AWS Lambda (Node.js/Python microservices for queue calculations and AI intent parsing).
3. **Database**: Amazon DynamoDB (Single-table design for Services, QueueTickets, EmergencyRequests, and Problems).
4. **AI & Triage**: Amazon Bedrock / Claude 3 Sonnet for automated document classification and urgency triage.
5. **Storage**: Amazon S3 for supporting document uploads (embassy proof PDFs, medical certificates).
6. **Auth**: Amazon Cognito User Pools for Student, Staff, and Admin identity management.
