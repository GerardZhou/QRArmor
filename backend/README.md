# Backend (Express + TypeScript)

Run locally:

1. Copy `.env.example` to `.env` and fill keys.
2. npm install
3. npm run dev

Notes:
- Uses VirusTotal and Google Generative API. Do not store API keys in source control.
- The VirusTotal integration is simplified; production should poll analysis results and parse engine findings.
