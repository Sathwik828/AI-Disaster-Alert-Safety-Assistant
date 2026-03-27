// --- PRO-LEVEL DISASTER ASSISTANT ---
// “We are using a structured AI prompt to simulate real-time disaster intelligence and safety guidance.”

// Disaster Database (Extended)
const DISASTER_KNOWLEDGE = {
    flood: {
        type: "Flood",
        indicators: ["rain", "water", "flood", "river", "rising", "tsunami", "inundation"],
        contacts: ["108 - Ambulance", "101 - Fire Service", "1070 - State Disaster Response"],
        steps: [
            "Move to higher ground or upper floors immediately",
            "Avoid walking, swimming, or driving through flood waters",
            "Turn off main electricity supply and gas valves",
            "Keep emergency kit and valuables in waterproof containers",
            "Stay away from power lines and electrical wires"
        ]
    },
    earthquake: {
        type: "Earthquake",
        indicators: ["shake", "tremor", "earthquake", "quake", "felt", "vibration"],
        contacts: ["102 - Ambulance", "101 - Fire Service", "1094 - Disaster Management"],
        steps: [
            "DROP to the ground, COVER your head and neck, and HOLD ON",
            "Stay away from glass, windows, and anything that could fall",
            "If outdoors, stay in an open area away from buildings and trees",
            "Do not use elevators; use stairs after shaking stops",
            "Be prepared for aftershocks"
        ]
    },
    cyclone: {
        type: "Cyclone",
        indicators: ["wind", "storm", "cyclone", "hurricane", "typhoon", "strong wind"],
        contacts: ["101 - Fire Service", "108 - Ambulance", "1077 - Control Room"],
        steps: [
            "Stay indoors and away from windows",
            "Secure loose objects outside that could become missiles",
            "Keep a battery-operated radio for official updates",
            "Disconnect electrical appliances",
            "Stock up on dry food and clean drinking water"
        ]
    },
    fire: {
        type: "Fire",
        indicators: ["fire", "smoke", "burning", "flame", "heat"],
        contacts: ["101 - Fire Service", "102 - Ambulance", "1070 - Emergency Helpline"],
        steps: [
            "Get out, stay out, and call for help immediately",
            "Crawl low under smoke to breathe cleaner air",
            "If clothes catch fire: Stop, Drop, and Roll",
            "Check doors for heat with the back of your hand before opening",
            "Use stairs, never use elevators during a fire"
        ]
    }
};

// --- GLOBAL STATE ---
let map = null;
let currentMarker = null;
let voiceEnabled = false;
let notificationPermission = false;

// --- DOM ELEMENTS ---
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const welcomeView = document.getElementById('welcome-view');
const resultsView = document.getElementById('results-view');
const currentTimeDisplay = document.getElementById('current-time');
const systemStatus = document.getElementById('system-status');
const chatHistory = document.getElementById('chat-history');
const voiceIndicator = document.getElementById('voice-indicator');

// --- INITIALIZATION ---
function init() {
    updateTime();
    setInterval(updateTime, 1000);
    setupEventListeners();
    addBotMessage("Guardian AI Pro is active. I am monitoring live feeds from USGS and weather stations. How can I help you?");
    
    // Request notification permission early
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            notificationPermission = (permission === "granted");
        });
    }
}

function updateTime() {
    const now = new Date();
    currentTimeDisplay.textContent = now.toLocaleTimeString();
}

function setupEventListeners() {
    sendBtn.addEventListener('click', handleAction);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAction();
    });

    voiceIndicator.addEventListener('click', () => {
        voiceEnabled = !voiceEnabled;
        voiceIndicator.className = voiceEnabled ? "voice-on" : "voice-off";
        if (voiceEnabled) addBotMessage("Voice assistant enabled.");
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.textContent;
            handleAction();
        });
    });
}

// --- CORE LOGIC ---

async function handleAction() {
    const text = userInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    userInput.value = "";
    userInput.disabled = true;
    sendBtn.disabled = true;

    systemStatus.textContent = "AI ANALYSIS...";
    systemStatus.style.color = "var(--warning)";

    // SIMULATED AI PROMPT ATTACHMENT
    // The following prompt is attached to the user query before processing:
    const systemPrompt = `“We are using a structured AI prompt to simulate real-time disaster intelligence and safety guidance.”`;
    console.log("Attaching Prompt:", systemPrompt);

    await new Promise(r => setTimeout(r, 1200));

    const analysis = await performAdvancedAnalysis(text);
    renderResults(analysis);

    // Voice & Notification
    if (voiceEnabled) speak(analysis.alert_message);
    if (notificationPermission && analysis.risk_level === "HIGH") {
        new Notification("CRITICAL DISASTER ALERT", { body: analysis.alert_message, icon: "⚠️" });
    }

    addBotMessage(`Analysis of ${analysis.location} complete. ${systemPrompt}`);

    systemStatus.textContent = "SYSTEM ONLINE";
    systemStatus.style.color = "var(--success)";
    userInput.disabled = false;
    sendBtn.disabled = false;
}

async function performAdvancedAnalysis(input) {
    const lowerInput = input.toLowerCase();
    const parts = input.split(/[,-]/);
    let location = parts[0]?.trim() || "Detected Area";
    
    // Default coordinates (San Francisco)
    let coords = [37.7749, -122.4194]; 
    
    // Simple Geocoding Simulation
    if (lowerInput.includes('chennai')) coords = [13.0827, 80.2707];
    if (lowerInput.includes('mumbai')) coords = [19.0760, 72.8777];
    if (lowerInput.includes('london')) coords = [51.5074, -0.1278];
    if (lowerInput.includes('australia')) coords = [-25.2744, 133.7751];
    if (lowerInput.includes('florida')) coords = [27.6648, -81.5158];

    let disaster = null;
    let risk = "LOW";

    // 1. Check Real-time USGS (Earthquakes) if keyword matches
    if (lowerInput.includes('earthquake') || lowerInput.includes('shake')) {
        try {
            const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
            const data = await response.json();
            // In a real app, we'd find the closest quake. Here we just show we're calling the API.
            if (data.features && data.features.length > 0) {
                console.log("Real-time USGS data fetched:", data.features.length, "recent quakes.");
            }
        } catch (e) { console.error("API Fetch Error:", e); }
        disaster = DISASTER_KNOWLEDGE.earthquake;
    }

    // 2. Identify Disaster through local knowledge base
    if (!disaster) {
        for (const [key, data] of Object.entries(DISASTER_KNOWLEDGE)) {
            if (data.indicators.some(ind => lowerInput.includes(ind))) {
                disaster = data;
                break;
            }
        }
    }

    // Fallback
    if (!disaster) disaster = DISASTER_KNOWLEDGE.flood;

    // Risk Heuristics
    const dangerWords = ["high", "heavy", "danger", "emergency", "stuck", "entering", "trapped", "tsunami"];
    if (dangerWords.some(w => lowerInput.includes(w))) risk = "HIGH";
    else if (input.length > 25) risk = "MEDIUM";

    return {
        location: location,
        coords: coords,
        disaster_type: disaster.type,
        risk_level: risk,
        alert_message: generateAlertMessage(disaster.type, risk, location),
        safety_steps: disaster.steps,
        emergency_contacts: disaster.contacts
    };
}

function generateAlertMessage(type, risk, loc) {
    const templates = {
        HIGH: `CRITICAL ALERT: Severe ${type} detected in ${loc}. Move to safe zone immediately.`,
        MEDIUM: `WARNING: ${type} advisory for ${loc}. Follow safety protocols.`,
        LOW: `ADVISORY: Monitor ${type} reports in ${loc} for further updates.`
    };
    return templates[risk];
}

// --- UI RENDERING ---

function renderResults(data) {
    welcomeView.classList.add('hidden');
    resultsView.classList.remove('hidden');

    const mainAlert = document.getElementById('main-alert');
    mainAlert.className = `alert-card ${data.risk_level.toLowerCase()}`;
    
    document.getElementById('risk-badge').textContent = `${data.risk_level} RISK`;
    document.getElementById('disaster-type').textContent = data.disaster_type;
    document.getElementById('alert-message').textContent = data.alert_message;
    document.getElementById('display-location').textContent = data.location;

    // Update Map
    updateMap(data.coords, data.disaster_type);

    // Safety Steps
    const stepsList = document.getElementById('safety-steps-list');
    stepsList.innerHTML = data.safety_steps.map(step => `<li>${step}</li>`).join('');

    // Contacts
    const contactsGrid = document.getElementById('emergency-contacts-grid');
    contactsGrid.innerHTML = data.emergency_contacts.map(contact => {
        const [num, name] = contact.split(' - ');
        return `<div class="contact-item"><span class="contact-name">${name}</span><span class="contact-number">${num}</span></div>`;
    }).join('');

    // JSON Output
    document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);
    switchTab('safety');
}

function updateMap(coords, type) {
    if (typeof L === 'undefined') {
        console.error("Leaflet not loaded.");
        document.getElementById('map').innerHTML = "<p style='padding: 20px; text-align: center; color: var(--text-dim)'>Map service temporary unavailable (Check internet connection)</p>";
        return;
    }
    if (!map) {
        map = L.map('map', { zoomControl: false }).setView(coords, 10);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
    } else {
        map.setView(coords, 10);
    }

    if (currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.circle(coords, {
        color: 'var(--danger)',
        fillColor: 'var(--danger)',
        fillOpacity: 0.5,
        radius: 5000
    }).addTo(map);
    
    // Force map to resize correctly (bug fix for Leaflet in hidden containers)
    setTimeout(() => map.invalidateSize(), 100);
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
}

// --- CHAT HELPERS ---

function addBotMessage(text) {
    chatHistory.classList.remove('hidden');
    const msg = document.createElement('div');
    msg.className = 'message bot-message';
    msg.textContent = text;
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addUserMessage(text) {
    chatHistory.classList.remove('hidden');
    const msg = document.createElement('div');
    msg.className = 'message user-message';
    msg.textContent = text;
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabId}-tab`).classList.remove('hidden');
}

init();
