# 🎭 THE SECRET WORD GAME

> **Impromptu Speaking Party Game & Chameleon Challenge REST API**  
> Developed with pride by [**YTS Developments**](https://shidan.magmc.in/) &bull; [YT Shidan (@ytshidan50)](https://github.com/ytshidan50)

---

## 🌟 Overview

**THE SECRET WORD GAME** is a fast-paced impromptu speaking party game and chameleon challenge designed for speech clubs, debate teams, classroom icebreakers, and casual game nights. 

A speaker receives a random discussion topic alongside a secretly assigned "chameleon" word. The speaker's goal is to deliver an impromptu speech, naturally weaving the secret word into their monologue at least **$N$ times** (configurable from 1 to 10, default 3) without making it obvious. When time expires, the audience attempts to guess what the secret word was before the speaker reveals the final answer and score!

---

## 🎮 How to Play

```
 ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
 │ 1. PICK TOPIC & WORD │ ───► │   2. SPEAK & WEAVE   │ ───► │  3. GUESS & REVEAL   │
 │ Category & Level     │      │ Hold-to-Peek Shield  │      │ Audience guesses     │
 │ Camouflaged Match    │      │ Timer + Speech Auto  │      │ Final score reveal   │
 └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

1. **Spin the Combo:** Select a category (*Fun*, *Hot Takes*, *Awkward*, *Roast*, *Conspiracy*) and difficulty tier (*Easy*, *Medium*, *Hard*).
2. **Hold to Peek:** The speaker holds the "Press & Hold to Peek" shield on their screen. The secret word is hidden from spectators and disappears as soon as they release touch/click.
3. **Impromptu Speech:** Start the timer! The speaker must meet or exceed the minimum threshold time (e.g. 1m, 2m, custom) while subtly repeating the secret word.
4. **Live Auto-Counter:** In-browser Speech Recognition auto-counts each mention in real time, with manual tap-dot fallbacks for noisy rooms.
5. **The Reveal:** Click Stop! The timer turns gold or overtime red, an celebratory Web Audio chime rings, and the final audience reveal modal permanently presents the secret word, total time, and repetition score!

---

## ✨ Key Features

- 🔒 **Hold-to-Peek Privacy Shield:** Mouse and touch event shield (`pointerdown`/`pointerup`/`mouseleave`) prevents audience members or cameras from catching a glimpse of the secret word.
- ⏱️ **Flexible Speaking Timer & Overtime:** Supports preset minimum thresholds (`1m`, `2m`, `2:30`, `3m`, and custom `mm:ss`). Plays a celebratory 4-note Web Audio synthesizer chord (C5-E5-G5-C6) upon crossing the threshold and tracks overtime seamlessly.
- 🎙️ **Token-Free Speech Recognition:** Built directly on the browser's native **Web Speech API** (`webkitSpeechRecognition`). Requires **zero API keys**, **zero external credits**, and operates with zero latency.
- 🔘 **Interactive Manual Fallback:** Interactive progress dots allow manual tapping to log repetitions if speaking in a noisy environment or when microphone access is disabled.
- 💾 **Full LocalStorage Persistence:** Never lose game state upon accidental page refresh. Active timer elapsed time, repetition counts, minimum thresholds, selected category, difficulty level, topic, and secret word are automatically saved and restored.
- 🎯 **Single Unified Dataset (`data/game_data.json`):** Clean, UTF-8 encoded JSON schema organizing curated topics and subtle chameleon words across categories and difficulty tiers.
- ⚡ **Zero-Dependency Local Servers:** Includes zero-dependency PowerShell (`server.ps1`) and Node.js (`server.js`) servers, plus a 1-click Windows batch launcher (`run.bat`).
- 🌐 **Modern Framework Integrations:** Production-ready Next.js App Router route (`nextjs_route.ts`), React TypeScript component (`DualComboComponent.tsx`) with Tailwind CSS, and Vercel serverless function (`api/combo.js`).

---

## 📁 Repository Structure

```
THE SECRET WORD GAME/
├── api/
│   └── combo.js                # Vercel Serverless Function (GET /api/combo)
├── data/
│   └── game_data.json          # Unified dataset (topics & camouflaged words)
├── .gitignore                  # Git ignore rules for node, logs, and OS caches
├── app.js                      # Vanilla client game engine & speech recognition
├── declarations.d.ts           # Ambient TypeScript definitions for standalone setup
├── doc.html                    # Interactive REST API & developer documentation
├── DualComboComponent.tsx      # Native Next.js / React component with Tailwind
├── index.html                  # Minimal high-contrast dark theme web app
├── nextjs_route.ts             # Next.js App Router route (app/api/combo/route.ts)
├── package.json                # Project dependencies and metadata
├── README.md                   # Project documentation and developer guide
├── run.bat                     # 1-click Windows batch launcher
├── server.js                   # Cross-platform Node.js HTTP server (zero deps)
├── server.ps1                  # Native Windows PowerShell HTTP server (zero deps)
├── style.css                   # Custom responsive CSS design system
├── tsconfig.json               # TypeScript compiler configuration
└── vercel.json                 # Vercel deployment and routing rules
```

---

## ⚡ Quick Start

### Option 1: 1-Click Windows Launcher (Easiest)
Simply double-click **`run.bat`** in Windows Explorer. It automatically boots the local server and launches `http://localhost:8080` in your default browser.

### Option 2: PowerShell Server (No Node.js Required)
Run directly from PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Navigate to: **`http://localhost:8080`**

### Option 3: Node.js Server
Run using standard Node.js:
```bash
node server.js
```
Navigate to: **`http://localhost:8080`**

### Option 4: Static File (Offline Mode)
Open **`index.html`** directly in any modern browser (`file:///.../index.html`). The application includes internal fallback data and functions 100% offline without a web server.

---

## 📡 REST API Reference

The backend provides a RESTful endpoint returning game combos with full CORS support (`Access-Control-Allow-Origin: *`).

### `GET /api/combo`

Returns a randomized topic and camouflaged secret word based on category and difficulty.

#### Query Parameters:
| Parameter | Type | Default | Options |
| :--- | :--- | :--- | :--- |
| `category` | `string` | `all` | `all`, `fun`, `hottakes`, `awkward`, `roast`, `conspiracy` |
| `difficulty` | `string` | `all` | `all`, `easy`, `medium`, `hard` |
| `count` | `number` | `3` | `1` to `10` (target repetitions) |

#### Sample Request:
```bash
curl -X GET "http://localhost:8080/api/combo?category=fun&difficulty=medium&count=3"
```

#### Sample JSON Response:
```json
{
  "success": true,
  "data": {
    "category": "fun",
    "difficulty": "medium",
    "targetRepetitions": 3,
    "topic": "Why your pet secretly thinks they are the landlord",
    "word": "Lease",
    "hint": "Try using financial or property terms naturally.",
    "rules": {
      "minSpeechTime": "02:00",
      "privacy": "Do not let the audience see the secret word before speaking."
    }
  },
  "timestamp": "2026-11-07T01:30:00.000Z"
}
```

Interactive developer documentation is available at **`http://localhost:8080/doc`** (or [`doc.html`](doc.html)).

---

## ⚛️ Next.js & React Integration

To integrate this game into an existing Next.js App Router project:

1. **Add the API Route:**
   Copy [`nextjs_route.ts`](nextjs_route.ts) into your Next.js application at:
   ```
   app/api/combo/route.ts
   ```
2. **Add the React Component:**
   Copy [`DualComboComponent.tsx`](DualComboComponent.tsx) into your `components/` directory.
3. **Render the Component:**
   ```tsx
   import DualComboComponent from "@/components/DualComboComponent";

   export default function Page() {
     return (
       <main className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
         <DualComboComponent />
       </main>
     );
   }
   ```

---

## 🌿 Git Branching Strategy

This project follows a structured Git branching workflow:

| Branch | Description | Purpose |
| :--- | :--- | :--- |
| **`main`** | Production Release | Stable, deployable production code ready for Vercel / live hosting. |
| **`development`** | Integration & Staging | Active integration branch where features are consolidated and tested. |
| **`feature/game-engine`** | Feature Branch | Core feature branch containing the game engine, Web Speech recognition, audio synthesizer, and localStorage persistence. |

### Switching Between Branches:
```bash
# Switch to main branch
git checkout main

# Switch to development branch
git checkout development

# Switch to feature branch
git checkout feature/game-engine
```

---

## 🚀 Deploying to Vercel

The project includes pre-configured [`vercel.json`](vercel.json) rewrites and a serverless function in `api/combo.js`:

```bash
# Deploy with Vercel CLI
vercel --prod
```

Or connect this GitHub repository directly in your [Vercel Dashboard](https://vercel.com).

---

## 👨‍💻 Author & Credits

- **Developer:** [**YT Shidan**](https://shidan.magmc.in/)
- **Organization:** **YTS Developments**
- **GitHub:** [@ytshidan50](https://github.com/ytshidan50)
- **Portfolio:** [https://shidan.magmc.in/](https://shidan.magmc.in/)

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for speaking clubs, workshops, and entertainment.
