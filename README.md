# 🚨 AI Disaster Alert & Safety Assistant

A premium, AI-driven disaster monitoring and safety intelligence dashboard. This application provides real-time risk assessment, automated safety protocols, and emergency guidance using advanced Artificial Intelligence.

## 🌟 Features

- **💎 Premium Dashboard UI**: Modern dark theme with Glassmorphism, futuristic gradients, and high-end typography.
- **🧠 AI Risk Intelligence**: Analyzes locations in real-time to determine disaster types and risk levels (HIGH, MEDIUM, LOW).
- **⚡ Advanced Animations**: Powered by **Framer Motion** for smooth page transitions, interactive hover states, and critical alert pulses.
- **🔊 Automatic Voice Alerts**: Uses Speech Synthesis and audio cues to announce high-risk warnings automatically.
- **🎤 Voice Input Support**: Integrated Webkit Speech Recognition for hands-free location analysis.
- **🗺️ Live Impact Maps**: Visualized disaster zones using Leaflet with custom dark-themed map skins.
- **📱 Fully Responsive**: Optimized for both mobile and desktop environments.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Mapping**: Leaflet.js
- **Backend**: Node.js, Express
- **Communication**: Axios

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- [npm](https://www.npmjs.com/) or [yarn] for package management.

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/Sathwik828/AI-Disaster-Alert-Safety-Assistant.git
cd AI-Disaster-Alert-Safety-Assistant
```

#### Set up the Server
```bash
cd disaster-ai/server
npm install
node server.js
```

#### Set up the Client
```bash
cd disaster-ai/client
npm install
npm run dev
```

### 3. Usage
- Open your browser and navigate to `http://localhost:5173`.
- Click the **"TEST ALERT SOUND"** button in the header once to unblock audio playback.
- Enter a location (e.g., "Tokyo" or "Miami") or use the microphone icon for voice input.
- Click **"ANALYZE RISK"** to generate the AI report and safety instructions.

## 📂 Project Structure

```text
├── disaster-ai
│   ├── client          # React + Vite Frontend
│   │   ├── src
│   │   │   ├── components  # Modular Glassmorphism components
│   │   │   └── index.css   # Custom animations and glass-styles
│   └── server          # Express Backend (API logic)
└── README.md
```

## 🛡️ License
Distributed under the MIT License.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---
*Created by [Sathwik](https://github.com/Sathwik828) with ❤️*
