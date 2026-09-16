# PulseClass — Product Documentation

## 1. Executive Summary

**PulseClass** is an ultra-fast, real-time classroom engagement SaaS platform engineered to solve the "silent classroom" dilemma. Instructors often pause during lectures to ask, *"Does everyone understand?"* or *"Should I move ahead?"*, only to be met with blank stares, awkward silence, or polite nods from the front row while lost students remain quiet.

PulseClass transforms classroom interaction into an instantaneous, frictionless reflex:
1. **Teacher Action**: Press `Q` on the keyboard → pick a curated question from the Quick Pulse Library → hit `Enter`.
2. **Student Action**: Within 200 milliseconds, the question appears on all students' devices → students tap their response in a single click.
3. **Instant Insight**: Aggregated results stream onto the instructor's display with real-time distribution bars. Responses are 100% anonymous to the instructor, eliminating all social friction and fear of judgment.

---

## 2. Target Audience & Personas

### Persona 1: The University Professor / Bootcamp Instructor (Vikram)
- **Environment**: Teaches fast-paced Computer Science lectures with 60–200 students.
- **Pain Points**: Cannot gauge comprehension without breaking lecture rhythm. Traditional polling tools (Mentimeter, Kahoot, Google Forms) require switching browser tabs, sharing new URLs/pins, waiting 30 seconds for logins, and ruin the flow.
- **Goals**: Check pace and understanding in under 10 seconds without lifting hands from the keyboard.

### Persona 2: The Hesitant Student (Aarav)
- **Environment**: First-year engineering student in a large lecture hall.
- **Pain Points**: Afraid of asking questions or admitting confusion publicly for fear of looking unprepared in front of peers and professors.
- **Goals**: Provide honest feedback anonymously so the professor knows when the class is struggling.

### Persona 3: Workshop Facilitator / Corporate Trainer (Priya)
- **Environment**: Conducts technical workshops and corporate webinars.
- **Pain Points**: Participants multitask or stay muted on Zoom/Teams. Difficult to know if explanations resonated.
- **Goals**: High engagement, rapid pulse checks at critical transition points, and post-session exportable summaries.

---

## 3. Core Problems & Solutions

| Traditional Classroom Reality | The PulseClass Solution |
|---|---|
| Instructor asks *"Any questions?"* → dead silence. | Instant anonymous poll via `Q` key. Students answer without social exposure. |
| Polling tools require 5 clicks, creating question forms, and waiting for pin entry. | Pre-curated **Quick Pulse Library** with 15+ common classroom questions launched in 2 keypresses. |
| Responses identify students, causing performative agreement. | Instructor view receives aggregate statistical data only (`Yes: 78%, No: 22%`). Zero student names. |
| Polls drag on indefinitely, wasting valuable lecture time. | Strict server-authoritative countdown timers (3s, 5s, 10s, 15s) that automatically close pulses. |
| Disconnects and mobile unreliability drop votes. | WebSocket auto-reconnect, persistent session state restoration, and lightweight mobile-first student UI. |

---

## 4. Key Capabilities & Features

### 4.1 Quick Pulse Library
A curated catalogue of instant pedagogical check-ins categorized by instructional intent:
- **Understanding**: *"Should I move ahead?"*, *"Do you understand this concept?"*, *"Was that explanation clear?"*, *"Do you need one more example?"*
- **Pace**: *"Am I going too fast?"*, *"Should we slow down?"*, *"Ready for the next topic?"*
- **Revision**: *"Should we revise this?"*, *"Do you want a quick recap?"*, *"Should we revisit the previous concept?"*
- **Doubt**: *"Does anyone need clarification?"*, *"Is there anything confusing?"*, *"Should I explain that differently?"*
- **Feedback**: *"Was this explanation helpful?"*, *"How would you rate this session so far?"*

### 4.2 Custom Pulse Builder
When standard templates aren't enough, instructors can press `C` to build customized polls:
- Custom question prompt
- Choice of response formats: Binary (`Yes/No`), 5-Star Rating (`1–5`), or Multiple Choice (2 to 6 custom options)
- Configurable countdown timer (3s to 30s)
- Anonymous response toggle

### 4.3 Keyboard-First Teacher UX
- `Q`: Open Quick Pulse command palette
- `1`–`9`: Instant select template
- `Enter`: Launch pulse to live room
- `C`: Open custom pulse builder
- `E`: Prompt end session confirmation
- `?`: Toggle keyboard shortcuts cheatsheet
- `Esc`: Close open modal / palette

### 4.4 Real-Time Aggregate Analytics
- WebSocket broadcast to instructor on each student response.
- Dynamic responsive percentage bars with micro-animations.
- Total response count and live participation percentage tracker.
- Post-session executive report detailing session duration, pulse-by-pulse breakdown, and aggregate engagement trends.

---

## 5. Security & Privacy Architecture
- **Complete Anonymity**: Socket payloads to instructors only broadcast aggregated counts and percentages. No user identity is attached to votes in any client payload.
- **Duplicate Prevention**: Compound unique indexing on `(pollId, studentId)` ensures every student can vote exactly once per pulse.
- **Role-Based Protection**: HTTP endpoints and WebSocket events enforce strict authorization (`instructor` vs `student`).
- **XSS & CSRF Hardened**: JWT session tokens are transported strictly over `httpOnly`, `sameSite` cookies.
