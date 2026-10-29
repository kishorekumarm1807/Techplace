# TechPlace — Placement Preparation & Tech Placement Tracking System

TechPlace is a high-performance student placement tracking and preparation system designed to calculate, track, and optimize a student's **Placement Readiness Score**.

---

## 🏛️ Architecture Overview

The system strictly adheres to the requested decoupled architecture:

1. **Frontend**: Modern React 18, Vite, Tailwind CSS, Lucide icons.
   - Run via: `npm run dev`
2. **Backend**: Pure Core Java SE (Standard Library only).
   - Zero Spring Boot, zero external web frameworks.
   - Built on standard `com.sun.net.httpserver.HttpServer`.
   - Clean OOP structure: `model`, `repository`, `service`, `controller`, `util`.
3. **Database / Persistence**: Pure local file-based persistence (`backend/data/*.json`).
   - Automatically initializes and manages storage.
   - Persists users, credentials, DSA problems & notes, Core CS progress, Aptitude problems count, and quiz attempts across restarts without external database servers.

---

## 🚀 Quick Start Guide

### 1. Start the Pure Core Java Backend
From the root directory or inside `backend/`:
```bash
# Windows Batch:
cd backend
run.bat

# Or direct Java command:
java -cp backend/bin Main
```
*Backend runs on `http://localhost:8080`.*

### 2. Start the Frontend
From the root directory:
```bash
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 📊 Placement Readiness Score Algorithm

The overall score is a deterministic, transparent composite metric:

$$\text{Placement Readiness Score} = (0.40 \times \text{DSA Score}) + (0.35 \times \text{Core CS Score}) + (0.25 \times \text{Aptitude Score})$$

- **DSA Score (0–100%)**:
  - Solved problem volume weighted by difficulty (Easy: 1.5 pts, Medium: 3.5 pts, Hard: 6.0 pts up to 70%).
  - Category variety across the 13 core DSA categories (up to 30%).
- **Core CS Score (0–100%)**:
  - Direct percentage of placement topics completed across the 7 subjects.
- **Aptitude Score (0–100%)**:
  - Number of problems solved across the 16 topics (up to 70%).
  - Topic coverage breadth across the 16 topics (up to 30%).

> ⚠️ **CRITICAL SEPARATION:** Quizzes evaluate practice and mock test recall. **Quiz scores do NOT contribute to the Placement Readiness Score** and are tracked completely separately.

---

## 📑 Completed 10 Required Views / Pages

1. **Landing Page**: Value proposition, 3-pillar breakdown, CTA.
2. **Sign In / Login**: Secure authentication with local session tokens.
3. **Register**: User profile creation (college, target role, graduation year).
4. **Dashboard**: Prominent Placement Readiness gauge, 3 pillar progress bars, strong/weak areas, recent DSA, and recent quiz summaries.
5. **DSA Tracker**: Log solved problems, difficulty breakdown (Easy/Med/Hard), platform tagging, search, category filters, and revision notes.
6. **Core CS Preparation**: 7 subjects (DBMS, OS, CN, OOP, DSA concepts, COA, Software Engineering) with completion toggles, beginner descriptions, interview focus notes, and curated learning references.
7. **Aptitude Preparation**: Exactly 16 aptitude topics with solved problem counters and reference study guides.
8. **Quiz & Practice**: 10-question rotating practice sessions with shuffle, immediate score calculation, and comprehensive explanations.
9. **Quiz Results & History**: Chronological log of past quiz attempts, scores, and percentages.
10. **Profile & Settings**: Modal accessible from top-right user button to edit profile information.
