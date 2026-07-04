# AI-Based Medical Prescription Reminder System

## Project Name
**MediRemind AI**

---

## Problem Statement
Patients often struggle to strictly adhere to complex doctor prescription times, dosage amounts, and guidelines (e.g. before or after food). Forgetting medicine timings or durations negatively affects recovery. Elderly patients, chronic symptom sufferers, and busy individuals especially require a simple, unified, and supervised system that monitors adherence, scans prescriptions, and notifies caretakers instantly of missed critical doses.

## Solution
**MediRemind AI** provides a smart, responsive healthcare workspace. Patients can drag and drop doctor slips or prescription bills to trigger mock OCR scans that extract medicines, dosages, and schedules instantly. The app allows robust schedule logging, interactive taken/missed checklist updates, dynamic adherence tracking indicators, and real-time mock SMS notifications sent to registered caretaker dashboards upon missed critical dosages.

---

## Features
- 📋 **Patient Health Portal**: Dynamic greeting, daily adherence level tracker, and custom lifestyle tip carousel.
- 🔍 **AI OCR Scan Engine Simulator**: Drag & drop prescription slip uploads with immediate mock character extraction and batch schedule loading.
- 📅 **Manual Prescription Scheduler**: Full-featured form to manually key in custom medicine names, duration intervals, guidelines, and dosage units.
- ⚡ **Interactive Status Log**: Mark doses as **Taken** or **Missed** directly inside desktop list views or mobile responsive cards.
- 🔔 **Caretaker Monitoring Hub**: Link a dedicated relative's name and email/phone, triggering immediate warnings if logs transition to Missed.
- 🧪 **Live System Sandbox Playground**: Feature-rich tab switcher (`OCR Demo`, `Reminder Scheduling`, `Caretaker Alerts`) embedded directly on the homepage for immediate exploration.
- ⚠️ **High-Visibility Safety Disclaimer**: Clear warnings indicating that the application is a tracking utility and does not substitute for qualified medical advice.

---

## Tech Stack
- **Frontend Framework**: React (v19)
- **Styling**: Tailwind CSS (v4)
- **Icon Library**: Lucide React
- **Persistence Engine**: Web storage (`localStorage`) with asynchronous fakeApi promise wrappers
- **Language**: TypeScript (Type safe)

---

## How to Run

1. **Install Base Dependencies**:
    ```bash
    npm install
    ```

2. **Launch Dev Workspace (Frontend + Backend)**:
    ```bash
    npm run dev:all
    ```

    Or run them separately in two terminals:
    - Terminal 1 (Backend): `npm run server`
    - Terminal 2 (Frontend): `npm run dev`

3. **Open Browser Preview**:
    Vite is configured to serve on port `3000` automatically. Navigate to:
    [http://localhost:3000](http://localhost:3000)

## Database

This project uses **SQLite** (file-based, zero configuration) for development. No external database installation is required. The database file is created automatically at `server/data/mediremind.db` on first run.

## Scripts

- `npm run dev` — Start Vite frontend only (port 3000)
- `npm run server` — Start Express backend only (port 3001)
- `npm run dev:all` — Start both frontend and backend concurrently

---

## Future Scope
- 🧠 **Production OCR Integration**: Integration with Google Cloud Vision or Tesseract API nodes for real-time document-parsing production deployments.
- 📱 **Real SMS & WhatsApp Reminders**: Direct-to-mobile alerts powered by SMS endpoints (e.g., Twilio) to support clients without active internet.
- 🩺 **Doctor/Clinic Portal**: Remote administration panel letting qualified physicians verify, upload, or adjust medicine schedules on behalf of patients.
- 💊 **Smart Pharmacy Check-in**: Automated pill quantity counts connected to neighborhood pharmacies for refills.
- 🗣️ **Regional Language & Voice Guidance**: Multilingual regional language read-aloud prompts for elderly accessibility.

---

## Safety Disclaimer
> ⚠️ **IMPORTANT SAFETY NOTE**: This system does not provide medical advice. It only helps users follow their doctor’s prescription. Always consult a qualified medical professional for health adjustments or serious diagnostics.
