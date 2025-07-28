// Firebase config - replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDrwJz-srfx9sl19P6CZ12wHJScUsdzzW8",
  authDomain: "stridesense-ac89e.firebaseapp.com",
  projectId: "stridesense-ac89e",
  storageBucket: "stridesense-ac89e.firebasestorage.app",
  messagingSenderId: "141261430054",
  appId: "1:141261430054:web:2dbe68242a9ed6d42af5e7",
  measurementId: "G-MFPRPHMZYE"
};

console.log("Script starting...");

// Initialize Firebase with error handling
try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    console.error("Firebase is not loaded!");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const auth = firebase?.auth();

const API_BASE_URL = "http://127.0.0.1:8000";

// ===== Container elements =====
const authSection = document.getElementById("auth-section");
const registerPanel = document.getElementById("register-panel");
const loginPanel = document.getElementById("login-panel");

const onboardSection = document.getElementById("onboard-section");
const profileSection = document.getElementById("profile-section");
const dashboardSection = document.getElementById("dashboard-section");
const supportSection = document.getElementById("support-section");

const userInfo = document.getElementById("user-info");
const userDisplayName = document.getElementById("user-display-name");

// Auth fields and buttons
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regName = document.getElementById("reg-name");
const btnRegister = document.getElementById("btn-register");
const regMessage = document.getElementById("reg-message");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const btnLogin = document.getElementById("btn-login");
const loginMessage = document.getElementById("login-message");

const btnShowLogin = document.getElementById("show-login");
const btnShowRegister = document.getElementById("show-register");

// Onboarding buttons
const btnChooseAthlete = document.getElementById("choose-athlete");
const btnChooseElder = document.getElementById("choose-elder");

// Profile form
const profileForm = document.getElementById("profile-form");
const profileName = document.getElementById("profile-name");
const profileDob = document.getElementById("profile-dob");
const profileGender = document.getElementById("profile-gender");
const profileHeight = document.getElementById("profile-height");
const profileWeight = document.getElementById("profile-weight");
const profileSport = document.getElementById("profile-sport");
const profileConditions = document.getElementById("profile-conditions");
const athleteExtra = document.getElementById("athlete-extra");
const elderExtra = document.getElementById("elder-extra");
const btnProfileSubmit = document.getElementById("btn-profile-submit");
const profileMessage = document.getElementById("profile-message");

// Activity & Wellness inputs
const inputActivityType = document.getElementById("input-activity-type");
const inputActivityDuration = document.getElementById("input-activity-duration");
const btnSubmitActivity = document.getElementById("btn-submit-activity");
const activityMessage = document.getElementById("activity-message");

const inputWellnessType = document.getElementById("input-wellness-type");
const inputWellnessLevel = document.getElementById("input-wellness-level");
const inputWellnessNotes = document.getElementById("input-wellness-notes");
const btnSubmitWellness = document.getElementById("btn-submit-wellness");
const wellnessMessage = document.getElementById("wellness-message");

// Wearable sync buttons (disabled as placeholder)
const btnHealthkit = document.getElementById("btn-sync-healthkit");
const btnGoogleFit = document.getElementById("btn-sync-googlefit");
const btnFitbit = document.getElementById("btn-sync-fitbit");

// AI Risk Prediction UI
const aiRoleSelector = document.getElementById("ai-role-selector");
const btnAiAthlete = document.getElementById("btn-ai-athlete");
const btnAiElder = document.getElementById("btn-ai-elder");
const aiAthleteForm = document.getElementById("ai-athlete-form");
const aiElderForm = document.getElementById("ai-elder-form");
const aiRiskResult = document.getElementById("ai-risk-result");

// Voice notes UI
const btnStartRec = document.getElementById("btn-start-recording");
const btnStopRec = document.getElementById("btn-stop-recording");
const voiceStatus = document.getElementById("voice-status");
const voiceTranscript = document.getElementById("voice-transcript");
const btnSubmitVoice = document.getElementById("btn-submit-voice");
const voiceMessage = document.getElementById("voice-message");

// Chart.js
const ctxActivityChart = document.getElementById("chart-activity")?.getContext('2d');
const ctxWellnessChart = document.getElementById("chart-wellness")?.getContext('2d');

// Global vars
let currentUser = null;
let currentUserToken = null;
let currentPersona = null; // "athlete" or "elder"
let activityChart = null;
let wellnessChart = null;

// Debug function to check if elements exist
function debugElements() {
  console.log("=== Element Debug ===");
  console.log("btnRegister:", btnRegister);
  console.log("btnLogin:", btnLogin);
  console.log("btnShowLogin:", btnShowLogin);
  console.log("btnShowRegister:", btnShowRegister);
  console.log("regEmail:", regEmail);
  console.log("regPassword:", regPassword);
  console.log("loginEmail:", loginEmail);
  console.log("loginPassword:", loginPassword);
  console.log("===================");
}

// --- UTILITIES ---

// Show only one section - FIXED VERSION
function showSections(...sections) {
  console.log("Showing sections:", sections.map(s => s?.id));
  
  // Hide all sections first
  const allSections = [authSection, onboardSection, profileSection, dashboardSection, supportSection];
  allSections.forEach(section => {
    if (section) {
      section.style.display = 'none';
      section.classList.add('hidden');
    }
  });
  
  // Show only the specified sections
  sections.forEach(section => {
    if (section) {
      section.style.display = 'block';
      section.classList.remove('hidden');
    }
  });
}

// Clear messages on inputs
function clearMessages() {
  [regMessage, loginMessage, profileMessage, activityMessage, wellnessMessage, aiRiskResult, voiceMessage].forEach(m => { 
    if (m) {
      m.textContent = ''; 
      m.className = 'message'; 
    }
  });
}

// Disable wearable sync buttons (placeholder only)
[btnHealthkit, btnGoogleFit, btnFitbit].forEach(btn => {
  if (btn) btn.disabled = true;
});

// --- AUTH HANDLERS ---

// Add event listeners with error handling
function addEventListeners() {
  console.log("Adding event listeners...");
  debugElements();
  
  if (btnShowLogin) {
    btnShowLogin.addEventListener('click', () => {
      console.log("Show login clicked");
      if (registerPanel) registerPanel.classList.add('hidden');
      if (loginPanel) loginPanel.classList.remove('hidden');
      clearMessages();
    });
  } else {
    console.error("btnShowLogin not found!");
  }

  if (btnShowRegister) {
    btnShowRegister.addEventListener('click', () => {
      console.log("Show register clicked");
      if (loginPanel) loginPanel.classList.add('hidden');
      if (registerPanel) registerPanel.classList.remove('hidden');
      clearMessages();
    });
  } else {
    console.error("btnShowRegister not found!");
  }

  if (btnRegister) {
    btnRegister.addEventListener('click', async () => {
      console.log("Register button clicked");
      clearMessages();
      const email = regEmail?.value?.trim();
      const password = regPassword?.value;
      const name = regName?.value?.trim();

      console.log("Register attempt with email:", email);

      if (!email || !password) {
        if (regMessage) {
          regMessage.textContent = "Please enter email and password.";
          regMessage.classList.add('error');
        }
        return;
      }
      
      if (btnRegister) {
        btnRegister.disabled = true;
        btnRegister.textContent = "Registering...";
      }
      
      try {
        if (!auth) {
          throw new Error("Firebase auth not initialized");
        }
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        if (name && userCredential.user) {
          await userCredential.user.updateProfile({ displayName: name });
        }
        if (regMessage) {
          regMessage.textContent = "Registration successful! Please login.";
          regMessage.classList.remove('error');
          regMessage.classList.add('success');
        }
        if (regEmail) regEmail.value = '';
        if (regPassword) regPassword.value = '';
        if (regName) regName.value = '';
      } catch (e) {
        console.error("Registration error:", e);
        if (regMessage) {
          regMessage.textContent = e.message;
          regMessage.classList.add('error');
        }
      } finally {
        if (btnRegister) {
          btnRegister.disabled = false;
          btnRegister.textContent = "Register";
        }
      }
    });
  } else {
    console.error("btnRegister not found!");
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      console.log("Login button clicked");
      clearMessages();
      const email = loginEmail?.value?.trim();
      const password = loginPassword?.value;
      
      console.log("Login attempt with email:", email);

      if (!email || !password) {
        if (loginMessage) {
          loginMessage.textContent = "Please enter email and password.";
          loginMessage.classList.add('error');
        }
        return;
      }
      
      if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = "Logging in...";
      }
      
      try {
        if (!auth) {
          throw new Error("Firebase auth not initialized");
        }
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        currentUserToken = await currentUser.getIdToken();
        if (userDisplayName) {
          userDisplayName.textContent = `Hello, ${currentUser.displayName || currentUser.email}`;
        }
        // Show onboarding section after successful login
        showSections(onboardSection);
      } catch (e) {
        console.error("Login error:", e);
        if (loginMessage) {
          loginMessage.textContent = e.message;
          loginMessage.classList.add('error');
        }
      } finally {
        if (btnLogin) {
          btnLogin.disabled = false;
          btnLogin.textContent = "Login";
        }
      }
    });
  } else {
    console.error("btnLogin not found!");
  }

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      console.log("Logout clicked");
      if (auth) {
        await auth.signOut();
      }
      currentUser = null;
      currentUserToken = null;
      if (userDisplayName) userDisplayName.textContent = "";
      showSections(authSection);
      if (registerPanel) registerPanel.classList.remove('hidden');
      if (loginPanel) loginPanel.classList.add('hidden');
      clearMessages();
    });
  }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing...");
  addEventListeners();
  
  // Initially show only auth section
  showSections(authSection);
});

// Also try to initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  console.log("Document still loading, waiting for DOMContentLoaded...");
} else {
  console.log("Document already loaded, initializing immediately...");
  addEventListeners();
  // Initially show only auth section
  showSections(authSection);
}

// --- ONBOARDING ---

if (btnChooseAthlete) {
  btnChooseAthlete.addEventListener('click', () => {
    console.log("Choose athlete clicked");
    currentPersona = "athlete";
    if (athleteExtra) athleteExtra.style.display = 'block';
    if (elderExtra) elderExtra.style.display = 'none';
    showSections(profileSection);
  });
}

if (btnChooseElder) {
  btnChooseElder.addEventListener('click', () => {
    console.log("Choose elder clicked");
    currentPersona = "elder";
    if (athleteExtra) athleteExtra.style.display = 'none';
    if (elderExtra) elderExtra.style.display = 'block';
    showSections(profileSection);
  });
}

// --- PROFILE ---

if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Profile form submitted");
    clearMessages();

    const profileData = {
      name: profileName?.value?.trim(),
      dob: profileDob?.value,
      gender: profileGender?.value,
      height: parseFloat(profileHeight?.value || 0),
      weight: parseFloat(profileWeight?.value || 0),
      sport: currentPersona === "athlete" ? profileSport?.value?.trim() : null,
      medical_conditions: currentPersona === "elder" ? profileConditions?.value?.trim() : null,
    };

    if (!profileData.name || !profileData.dob || !profileData.gender || !profileData.height || !profileData.weight) {
      if (profileMessage) {
        profileMessage.textContent = "Please fill out all required fields.";
        profileMessage.classList.add('error');
      }
      return;
    }

    // Save profile to backend (placeholder: implement actual API call)
    // For now just simulate success:
    if (profileMessage) {
      profileMessage.textContent = "Profile saved successfully.";
      profileMessage.classList.add('success');
    }

    // Proceed to dashboard
    showSections(dashboardSection);
    loadDashboardData();
  });
}

// --- ACTIVITY & WELLNESS LOGGING ---

if (btnSubmitActivity) {
  btnSubmitActivity.addEventListener('click', async () => {
    console.log("Submit activity clicked");
    clearMessages();
    const type = inputActivityType?.value?.trim();
    const duration = Number(inputActivityDuration?.value);
    
    if (!type || !duration || duration <= 0) {
      if (activityMessage) {
        activityMessage.textContent = "Please enter valid activity type and duration.";
        activityMessage.classList.add('error');
      }
      return;
    }

    if (btnSubmitActivity) {
      btnSubmitActivity.disabled = true;
      btnSubmitActivity.textContent = "Logging...";
    }

    try {
      const response = await fetch(`${API_BASE_URL}/data/activity/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUserToken}`
        },
        body: JSON.stringify({
          user_id: currentUser.uid,
          timestamp: new Date().toISOString(),
          type,
          duration_minutes: duration
        })
      });
      if (!response.ok) throw new Error("Failed to log activity");

      if (activityMessage) {
        activityMessage.textContent = "Activity logged successfully!";
        activityMessage.classList.add('success');
      }
      if (inputActivityType) inputActivityType.value = "";
      if (inputActivityDuration) inputActivityDuration.value = "";
      loadDashboardData();

    } catch (e) {
      console.error("Activity logging error:", e);
      if (activityMessage) {
        activityMessage.textContent = e.message;
        activityMessage.classList.add('error');
      }
    } finally {
      if (btnSubmitActivity) {
        btnSubmitActivity.disabled = false;
        btnSubmitActivity.textContent = "Add Activity";
      }
    }
  });
}

if (btnSubmitWellness) {
  btnSubmitWellness.addEventListener('click', async () => {
    console.log("Submit wellness clicked");
    clearMessages();
    const log_type = inputWellnessType?.value;
    const level = Number(inputWellnessLevel?.value);
    const description = inputWellnessNotes?.value?.trim();
    
    if (!log_type || !level || level < 1 || level > 10) {
      if (wellnessMessage) {
        wellnessMessage.textContent = "Please select wellness log type and a level between 1 and 10.";
        wellnessMessage.classList.add('error');
      }
      return;
    }
    
    if (btnSubmitWellness) {
      btnSubmitWellness.disabled = true;
      btnSubmitWellness.textContent = "Logging...";
    }

    try {
      const response = await fetch(`${API_BASE_URL}/data/wellness/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUserToken}`
        },
        body: JSON.stringify({
          user_id: currentUser.uid,
          timestamp: new Date().toISOString(),
          log_type,
          level,
          description
        })
      });
      if (!response.ok) throw new Error("Failed to log wellness");

      if (wellnessMessage) {
        wellnessMessage.textContent = "Wellness log added!";
        wellnessMessage.classList.add('success');
      }
      if (inputWellnessLevel) inputWellnessLevel.value = "";
      if (inputWellnessNotes) inputWellnessNotes.value = "";
      loadDashboardData();

    } catch (e) {
      console.error("Wellness logging error:", e);
      if (wellnessMessage) {
        wellnessMessage.textContent = e.message;
        wellnessMessage.classList.add('error');
      }
    } finally {
      if (btnSubmitWellness) {
        btnSubmitWellness.disabled = false;
        btnSubmitWellness.textContent = "Add Wellness Log";
      }
    }
  });
}

// --- AI Risk Prediction ---

if (btnAiAthlete) {
  btnAiAthlete.addEventListener('click', () => {
    if (aiElderForm) aiElderForm.classList.add("hidden");
    if (aiAthleteForm) aiAthleteForm.classList.remove("hidden");
    if (aiRiskResult) aiRiskResult.textContent = "";
  });
}

if (btnAiElder) {
  btnAiElder.addEventListener('click', () => {
    if (aiAthleteForm) aiAthleteForm.classList.add("hidden");
    if (aiElderForm) aiElderForm.classList.remove("hidden");
    if (aiRiskResult) aiRiskResult.textContent = "";
  });
}

if (aiAthleteForm) {
  aiAthleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (aiRiskResult) aiRiskResult.textContent = "";
    const payload = {
      fatigue: Number(document.getElementById("ai-fatigue")?.value || 0),
      soreness: Number(document.getElementById("ai-soreness")?.value || 0),
      sleep_hours: Number(document.getElementById("ai-sleep")?.value || 0),
      stress: Number(document.getElementById("ai-stress")?.value || 0)
    };
    try {
      await sendAIRiskRequest("/ai/predict/athlete-risk", payload);
    } catch (e) {
      if (aiRiskResult) {
        aiRiskResult.textContent = e.message;
        aiRiskResult.classList.add("error");
      }
    }
  });
}

if (aiElderForm) {
  aiElderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (aiRiskResult) aiRiskResult.textContent = "";
    const payload = {
      pain: Number(document.getElementById("ai-pain")?.value || 0),
      fatigue: Number(document.getElementById("ai-elder-fatigue")?.value || 0),
      steps: Number(document.getElementById("ai-steps")?.value || 0)
    };
    try {
      await sendAIRiskRequest("/ai/predict/elder-risk", payload);
    } catch (e) {
      if (aiRiskResult) {
        aiRiskResult.textContent = e.message;
        aiRiskResult.classList.add("error");
      }
    }
  });
}

async function sendAIRiskRequest(endpoint, payload) {
  if (aiRiskResult) {
    aiRiskResult.classList.remove("error", "success");
    aiRiskResult.textContent = "Checking risk...";
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${currentUserToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Error from server: ${response.statusText}`);
  const result = await response.json();
  if (aiRiskResult) {
    aiRiskResult.innerHTML = `<strong>Risk Level:</strong> ${result.risk_level} <br/>
        <strong>Recommendation:</strong> ${result.recommendation}
    `;
    aiRiskResult.classList.add("success");
  }
}

// --- Dashboard Visualization ---

async function loadDashboardData() {
  // Get activity logs and wellness logs for current user
  try {
    const [activities, wellness] = await Promise.all([
      fetch(`${API_BASE_URL}/data/activity/?user_id=${currentUser.uid}`, {
        headers: { Authorization: `Bearer ${currentUserToken}` }
      }).then(res => res.json()),
      fetch(`${API_BASE_URL}/data/wellness/?user_id=${currentUser.uid}`, {
        headers: { Authorization: `Bearer ${currentUserToken}` }
      }).then(res => res.json())
    ]);

    renderActivityChart(activities || []);
    renderWellnessChart(wellness || []);
  } catch (e) {
    console.error("Failed to load dashboard data", e);
  }
}

function renderActivityChart(data) {
  if (!ctxActivityChart) return;
  if (activityChart) activityChart.destroy();
  const labels = data.map(item => new Date(item.timestamp).toLocaleDateString());
  const durations = data.map(item => item.duration_minutes || 0);
  activityChart = new Chart(ctxActivityChart, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Activity Duration (min)",
        data: durations,
        backgroundColor: "rgba(76,175,80,0.7)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderWellnessChart(data) {
  if (!ctxWellnessChart) return;
  if (wellnessChart) wellnessChart.destroy();
  const labels = data.map(item => new Date(item.timestamp).toLocaleDateString());
  const levels = data.map(item => item.level || 0);
  wellnessChart = new Chart(ctxWellnessChart, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Wellness Level",
        data: levels,
        fill: true,
        borderColor: "rgb(76,175,80)",
        backgroundColor: "rgba(76,175,80,0.25)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 10 }
      }
    }
  });
}

// --- Voice Notes (Basic browser speech recognition) ---
let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isRecording = true;
    if (voiceStatus) voiceStatus.textContent = "Recording started...";
    if (btnStartRec) btnStartRec.disabled = true;
    if (btnStopRec) btnStopRec.disabled = false;
    if (btnSubmitVoice) btnSubmitVoice.disabled = true;
    if (voiceTranscript) voiceTranscript.value = '';
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        if (voiceTranscript) voiceTranscript.value += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    if (voiceStatus) voiceStatus.textContent = "Listening... (Interim: " + interimTranscript + ")";
  };

  recognition.onerror = (event) => {
    if (voiceStatus) voiceStatus.textContent = "Error: " + event.error;
    stopRecording();
  };

  recognition.onend = () => {
    isRecording = false;
    if (voiceStatus) voiceStatus.textContent = "Recording stopped.";
    if (btnStartRec) btnStartRec.disabled = false;
    if (btnStopRec) btnStopRec.disabled = true;
    if (btnSubmitVoice) btnSubmitVoice.disabled = voiceTranscript?.value?.trim() === '';
  };
} else {
  if (voiceStatus) voiceStatus.textContent = "Speech recognition not supported in your browser.";
  if (btnStartRec) btnStartRec.disabled = true;
}

if (btnStartRec) {
  btnStartRec.addEventListener('click', () => {
    if (!isRecording && recognition) recognition.start();
  });
}

if (btnStopRec) {
  btnStopRec.addEventListener('click', () => {
    if (isRecording && recognition) recognition.stop();
  });
}

if (btnSubmitVoice) {
  btnSubmitVoice.addEventListener('click', async () => {
    if (voiceMessage) voiceMessage.textContent = "";
    if (btnSubmitVoice) btnSubmitVoice.disabled = true;
    try {
      const text = voiceTranscript?.value?.trim();
      if (!text) {
        if (voiceMessage) voiceMessage.textContent = "No transcription to submit.";
        return;
      }
      // Send to backend NLP + store (implement as needed)
      // Example endpoint POST /nlp/analyze-text with auth headers
      const response = await fetch(`${API_BASE_URL}/nlp/analyze-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUserToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text})
      });
      if (!response.ok) throw new Error("Failed to send voice note");
      if (voiceMessage) voiceMessage.textContent = "Voice note submitted successfully.";
      if (voiceTranscript) voiceTranscript.value = '';
    } catch (e) {
      if (voiceMessage) voiceMessage.textContent = e.message;
    } finally {
      if (btnSubmitVoice) btnSubmitVoice.disabled = false;
    }
  });
}

// --- Initial app state based on auth ---
if (auth) {
  auth.onAuthStateChanged(async (user) => {
    clearMessages();
    if (user) {
      currentUser = user;
      currentUserToken = await user.getIdToken();
      if (userDisplayName) userDisplayName.textContent = `Welcome, ${user.displayName || user.email}`;
      // Show onboarding section for authenticated users
      showSections(onboardSection);
    } else {
      currentUser = null;
      currentUserToken = null;
      if (userDisplayName) userDisplayName.textContent = "";
      // Show auth section for non-authenticated users
      showSections(authSection);
      if (registerPanel) registerPanel.classList.remove('hidden');
      if (loginPanel) loginPanel.classList.add('hidden');
    }
  });
}

console.log("Script loaded successfully");
