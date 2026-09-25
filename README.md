# Accenture Technical MCQ Mocks

Interactive practice app for **Section 3 — Technical MCQ — Mixed Topics** from Mock Tests 1–10.

Psychometric, cognitive games, SQL, frontend, and backend coding sections are not included.

github pages - [https://befearfull.github.io/](https://befearfull.github.io/self-assessment-tool/)
## Run locally

```bash

npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

## Behaviour

- One question at a time, no instant right/wrong feedback
- Answers persist in `localStorage` so a refresh resumes the test
- Timer auto-submits; results (score, percentage, accuracy, full review) appear only after submit
- Home lists attempted / last score; History lists past attempts
- Shuffle on start, retake, and review-incorrect after results

Questions are a 5-item sample from each PDF’s Technical MCQ section.
