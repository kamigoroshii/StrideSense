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
const btnAiAutofill = document.getElementById('btn-ai-autofill');

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
const btnAiVoiceFill = document.getElementById("btn-ai-voice-fill");
const btnAiVoiceFillElder = document.getElementById("btn-ai-voice-fill-elder");

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

// Simulated sample wearable data (Replace later with real device fetch)
const SAMPLE_WEARABLE_AI = {
  fatigue: 2,
  soreness: 3,
  sleep_hours: 7.1,
  stress: 2
};


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
        
        // After successful login, determine next step (onboarding or dashboard)
        const profile = await fetchUserProfile(currentUser.uid);
        if (!profile) {
          // No profile found, direct to onboarding
          showSections(onboardSection);
        } else {
          // Profile exists, direct to dashboard
          currentPersona = profile.user_type || profile.role || null;
          populateProfileUI(profile);
          showSections(dashboardSection);
          loadDashboardData();
        }
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
      currentPersona = null;
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
  
  // The onAuthStateChanged listener will handle initial routing
});

// Also try to initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  console.log("Document still loading, waiting for DOMContentLoaded...");
} else {
  console.log("Document already loaded, initializing immediately...");
  addEventListeners();
  // The onAuthStateChanged listener will handle initial routing
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
      user_type: currentPersona, // athlete or elder
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

    // Save profile to backend
    const savedProfile = await saveUserProfile(profileData);
    if (savedProfile) {
      if (profileMessage) {
        profileMessage.textContent = "Profile saved successfully.";
        profileMessage.classList.add('success');
      }
      // Proceed to dashboard
      populateProfileUI(savedProfile); // Update UI with saved profile
      showSections(dashboardSection);
      loadDashboardData();
    } else {
      if (profileMessage) {
        profileMessage.textContent = "Failed to save profile. Please try again.";
        profileMessage.classList.add('error');
      }
    }
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

function plotWeeklyAverages(data, label, canvasId, color) {
  // Destroy existing chart if it exists
  const existingChart = Chart.getChart(canvasId);
  if (existingChart) {
      existingChart.destroy();
  }

  // Group by ISO week for last 5 weeks:
  const weekGroups = {};
  data.forEach(item => {
    const date = new Date(item.timestamp);
    const yearWeek = `${date.getFullYear()}-W${getISOWeek(date)}`;
    weekGroups[yearWeek] = weekGroups[yearWeek] || [];
    if (item[label] !== undefined) weekGroups[yearWeek].push(Number(item[label]));
  });
  const labels = Object.keys(weekGroups).sort(); // Ensure labels are sorted
  const averages = labels.map(
    w => weekGroups[w].reduce((a, b) => a + b, 0) / weekGroups[w].length
  );

  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (ctx) {
      new Chart(ctx, {
          type: 'line',
          data: { labels, datasets: [{ label: `${label} (weekly avg)`, data: averages, backgroundColor: color, borderColor: color, fill: false }] },
          options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });
  }
}

function getISOWeek(date) {
  var d = new Date(date.valueOf());
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// NOTE: These calls should be moved into loadDashboardData or a similar function
// that executes *after* data is fetched, not globally.
// plotWeeklyAverages(activities, "Heart_Rate_BPM", "ai-hr-chart", "rgba(76,175,80,0.7)");
// plotWeeklyAverages(wellness, "fatigue", "ai-fatigue-chart", "rgba(244,67,54,0.7)");


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
    
    // Map form inputs to model features with realistic defaults
    const fatigue = Number(document.getElementById("ai-fatigue")?.value || 1.0);
    const soreness = Number(document.getElementById("ai-soreness")?.value || 2);
    const sleep_hours = Number(document.getElementById("ai-sleep")?.value || 7);
    const stress = Number(document.getElementById("ai-stress")?.value || 3);
    
    // Convert wellness metrics to model features
    const payload = {
      Heart_Rate_BPM: 70 + (fatigue * 10) + (stress * 5), // Base HR + fatigue/stress impact
      Respiratory_Rate_BPM: 15 + (fatigue * 2) + (stress * 1), // Base RR + fatigue/stress impact
      Skin_Temperature_C: 36.5 + (fatigue * 0.3) + (stress * 0.2), // Base temp + fatigue/stress impact
      Blood_Oxygen_Level_Percent: 98 - (fatigue * 1) - (stress * 0.5), // Base O2 - fatigue/stress impact
      Impact_Force_Newtons: 50 + (fatigue * 20) + (soreness * 15), // Base impact + fatigue/soreness impact
      Cumulative_Fatigue_Index: fatigue, // Direct mapping
      Duration_Minutes: 60 + (fatigue * 10), // Base duration + fatigue impact
      Injury_Risk_Score: 50 + (fatigue * 5) + (soreness * 3) + (stress * 2) // Base score + all factors
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

function factorColor(val, label) {
  // Example: define logic based on thresholds per factor
  if (["soreness", "fatigue", "pain"].includes(label) && val >= 7) return "red";
  if (["soreness", "fatigue", "pain"].includes(label) && val >= 5) return "orange";
  if (["sleep_hours"].includes(label) && val < 6) return "red";
  return "green";
}

function renderFactorsRow(factors) {
  if (!factors || typeof factors !== 'object' || Object.keys(factors).length === 0) {
    return '<i>No contributing factor data available.</i>';
  }
  return Object.entries(factors).map(([k, v]) => {
    let color = '#43a047'; // green default
    if (['pain', 'fatigue', 'soreness'].includes(k)) {
      if (v >= 7) color = '#e53935'; // red
      else if (v >= 4) color = '#fbc02d'; // orange
    } else if (['sleep', 'sleep_hours'].includes(k)) {
      if (v < 6) color = '#e53935'; // red
    }
    return `<span style="color:${color}; font-weight:bold;">${k}: ${v}</span>`;
  }).join(', ');
}
async function sendAIRiskRequest(endpoint, payload) {
  if (aiRiskResult) {
    aiRiskResult.classList.remove("error", "success");
    aiRiskResult.textContent = "Checking risk...";
  }
  try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${currentUserToken}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          const errorData = await response.json(); // Try to parse error message from body
          throw new Error(`Error from server: ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
      }
      const result = await response.json();
      if (aiRiskResult) {
          aiRiskResult.innerHTML = `
              <b>Risk Level:</b> <span style="color:${riskColor(result.risk_level)}">${result.risk_level}</span><br>
              <b>Contributing Factors:</b> ${renderFactorsRow(result.contributing_factors)}<br>
              <b>Recommendation:</b> ${result.recommendation}
          `;
          aiRiskResult.classList.add("success");
      }
      // Reload risk history after a new prediction
      await renderRiskHistory();
  } catch (e) {
      console.error("AI Risk Prediction error:", e);
      if (aiRiskResult) {
          aiRiskResult.textContent = e.message;
          aiRiskResult.classList.add("error");
      }
  }
}

// --- Dashboard Visualization ---

async function loadDashboardData() {
  // Get activity logs and wellness logs for current user
  if (!currentUser || !currentUserToken) {
    console.warn("User not logged in or token not available, cannot load dashboard data.");
    return;
  }
  try {
    const [activitiesResp, wellnessResp] = await Promise.all([
      fetch(`${API_BASE_URL}/data/activity/?user_id=${currentUser.uid}`, {
        headers: { Authorization: `Bearer ${currentUserToken}` }
      }),
      fetch(`${API_BASE_URL}/data/wellness/?user_id=${currentUser.uid}`, {
        headers: { Authorization: `Bearer ${currentUserToken}` }
      })
    ]);

    const activities = activitiesResp.ok ? await activitiesResp.json() : [];
    const wellness = wellnessResp.ok ? await wellnessResp.json() : [];

    renderActivityChart(activities || []);
    renderWellnessChart(wellness || []);
    await renderRiskHistory();

    // Plot weekly averages (assuming you want to show these on dashboard)
    // You might need to refine the data for these specific charts
    // if activities or wellness data doesn't directly contain "Heart_Rate_BPM" or "fatigue" properties.
    // For now, let's assume they might be present in some form, or will be derived.
    // For demonstration, let's use example data if actual values are missing or hard to chart.
    if (activities.length > 0) {
        // Example: if activity data has a 'Heart_Rate_BPM' or similar, plot it.
        // For simplicity, let's assume we want to plot average duration if no specific metric is available.
        plotWeeklyAverages(activities, "duration_minutes", "chart-activity", "rgba(76,175,80,0.7)");
    }
    if (wellness.length > 0) {
        plotWeeklyAverages(wellness, "level", "chart-wellness", "rgba(244,67,54,0.7)");
    }


  } catch (e) {
    console.error("Failed to load dashboard data", e);
  }
}

async function renderRiskHistory() {
  if (!currentUser || !currentUserToken) {
    console.warn("User not logged in or token not available, cannot render risk history.");
    return;
  }
  try {
    const resp = await fetch(`${API_BASE_URL}/risk_predictions?user_id=${currentUser.uid}`, {
      headers: { Authorization: `Bearer ${currentUserToken}` }
    });
    if (!resp.ok) {
        console.error("Failed to fetch risk predictions:", resp.status, resp.statusText);
        return;
    }
    const data = await resp.json();
    const tbody = document.querySelector("#risk-history-table tbody");
    if (tbody) {
        tbody.innerHTML = "";
        data.slice(-10).reverse().forEach(row => { // Show last 10, newest first
            const d = new Date(row.timestamp).toLocaleString();
            // Ensure contributing_factors exists before trying to map
            const factors = Object.entries(row.output?.contributing_factors || {})
                .map(([k, v]) => `<span>${k}:${v}</span>`)
                .join(", ");
            tbody.innerHTML += `<tr>
                <td>${d}</td>
                <td style="color:${riskColor(row.output?.risk_level)}">${row.output?.risk_level || 'N/A'}</td>
                <td>${factors}</td>
                <td>${row.output?.recommendation || 'N/A'}</td>
            </tr>`;
        });
    }
  } catch (e) {
    console.error("Error rendering risk history:", e);
  }
}

function riskColor(riskLevel) {
  switch(riskLevel?.toLowerCase()) {
    case 'low': return 'green';
    case 'medium': return 'orange';
    case 'high': return 'red';
    default: return 'black';
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
    stopRecording(); // Define stopRecording function or directly stop
  };

  recognition.onend = () => {
    isRecording = false;
    if (voiceStatus) voiceStatus.textContent = "Recording stopped.";
    if (btnStartRec) btnStartRec.disabled = false;
    if (btnStopRec) btnStopRec.disabled = true;
    if (voiceTranscript && btnSubmitVoice) btnSubmitVoice.disabled = voiceTranscript.value.trim() === '';
  };

  // Helper function for stopping recognition (if not already defined)
  function stopRecording() {
    if (recognition && isRecording) {
      recognition.stop();
      isRecording = false;
    }
  }

} else {
  if (voiceStatus) voiceStatus.textContent = "Speech recognition not supported in your browser.";
  if (btnStartRec) btnStartRec.disabled = true;
  if (btnStopRec) btnStopRec.disabled = true;
  if (btnSubmitVoice) btnSubmitVoice.disabled = true;
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

if (btnAiAutofill) { // Check if element exists before adding listener
    btnAiAutofill.addEventListener('click', () => {
      // Fill all relevant AI fields for athlete form
      Object.entries(SAMPLE_WEARABLE_AI).forEach(([k, v]) => {
        const el = document.getElementById('ai-' + k.replace(/_/g, '-').toLowerCase());
        if (el) el.value = v;
      });
    });
}

// Voice input for AI athlete form
if (btnAiVoiceFill) {
  btnAiVoiceFill.onclick = () => {
    if (!recognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) { 
          transcript += event.results[i][0].transcript; 
        }
      }
      
      // Simple parsing: look for "fatigue 5", "sleep 7"
      const aiFatigue = document.getElementById("ai-fatigue");
      const aiSoreness = document.getElementById("ai-soreness");
      const aiSleep = document.getElementById("ai-sleep");
      const aiStress = document.getElementById("ai-stress");
      
      if (aiFatigue) aiFatigue.value = (/fatigue\s*(\d+)/i.exec(transcript)||[])[1] || aiFatigue.value;
      if (aiSoreness) aiSoreness.value = (/soreness\s*(\d+)/i.exec(transcript)||[])[1] || aiSoreness.value;
      if (aiSleep) aiSleep.value = (/sleep\s*(\d+(?:\.\d+)?)/i.exec(transcript)||[])[1] || aiSleep.value;
      if (aiStress) aiStress.value = (/stress\s*(\d+)/i.exec(transcript)||[])[1] || aiStress.value;

      // Re-enable recognition for next input if desired, or stop
      recognition.stop(); 
    };
    
    recognition.start();
  };
}

// Voice input for AI elder form
if (btnAiVoiceFillElder) {
  btnAiVoiceFillElder.onclick = () => {
    if (!recognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) { 
          transcript += event.results[i][0].transcript; 
        }
      }
      
      // Parse elder form fields
      const aiPain = document.getElementById("ai-pain");
      const aiElderFatigue = document.getElementById("ai-elder-fatigue");
      const aiSteps = document.getElementById("ai-steps");
      
      if (aiPain) aiPain.value = (/pain\s*(\d+)/i.exec(transcript)||[])[1] || aiPain.value;
      if (aiElderFatigue) aiElderFatigue.value = (/fatigue\s*(\d+)/i.exec(transcript)||[])[1] || aiElderFatigue.value;
      if (aiSteps) aiSteps.value = (/steps\s*(\d+)/i.exec(transcript)||[])[1] || aiSteps.value;

      // Re-enable recognition for next input or stop
      recognition.stop();
    };
    
    recognition.start();
  };
}

// CSV Download functionality
const btnDownloadCsv = document.getElementById('btn-download-csv');
if (btnDownloadCsv) {
  btnDownloadCsv.onclick = async () => {
    if (!currentUser || !currentUserToken) {
        alert("Please log in to download data.");
        return;
    }
    try {
      const [activities, wellness] = await Promise.all([
        fetch(`${API_BASE_URL}/data/activity/?user_id=${currentUser.uid}`, { headers: { Authorization: `Bearer ${currentUserToken}` } }).then(r => {
            if (!r.ok) throw new Error("Failed to fetch activities for CSV");
            return r.json();
        }),
        fetch(`${API_BASE_URL}/data/wellness/?user_id=${currentUser.uid}`, { headers: { Authorization: `Bearer ${currentUserToken}` } }).then(r => {
            if (!r.ok) throw new Error("Failed to fetch wellness for CSV");
            return r.json();
        })
      ]);
      function arrayToCSV(data) {
        if (!data || !data.length) return "";
        // Extract all unique keys from all objects to ensure all columns are present
        const allKeys = new Set();
        data.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));
        const keys = Array.from(allKeys).sort(); // Sort keys for consistent column order

        const csv = [keys.map(k => `"${k}"`).join(',')]; // Wrap headers in quotes
        for (const row of data) csv.push(keys.map(k => `"${(row[k] === null || row[k] === undefined) ? "" : String(row[k]).replace(/"/g, '""')}"`).join(',')); // Handle null/undefined, escape quotes
        return csv.join('\r\n');
      }
      const csvContent = "Activities:\r\n" + arrayToCSV(activities) + '\r\n\r\n' + "Wellness:\r\n" + arrayToCSV(wellness);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "pulsepro-data.csv"; document.body.appendChild(a);
      a.click(); URL.revokeObjectURL(url); document.body.removeChild(a);
    } catch (error) {
        console.error("Error generating CSV:", error);
        alert("Failed to download data: " + error.message);
    }
  };
}


// Helper to fetch user profile from backend
async function fetchUserProfile(uid) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${uid}`, {
      headers: { Authorization: `Bearer ${currentUserToken}` }
    });
    if (res.status === 404) { // User profile not found
        return null;
    }
    if (!res.ok) {
        const errorData = await res.text();
        console.error(`Failed to fetch user profile: ${res.status} - ${errorData}`);
        throw new Error(`Failed to fetch user profile: ${res.statusText}`);
    }
    const profile = await res.json();
    return profile;
  } catch (e) {
    console.error("Failed to fetch user profile", e);
    return null; // Return null on any error to indicate profile doesn't exist or couldn't be fetched
  }
}

// Save user profile to backend
async function saveUserProfile(profile) {
  try {
    console.log("Saving profile data:", profile);
    const res = await fetch(`${API_BASE_URL}/users/${currentUser.uid}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${currentUserToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    });
    console.log("Response status:", res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to save profile: ${res.status} ${errorText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Save profile error:", err);
    return null;
  }
}

// Use this to update UI with profile data
function populateProfileUI(profile) {
  if (userDisplayName) {
    userDisplayName.textContent = `Welcome, ${profile.name || currentUser.email}`;
  }
  // Store profile data globally for use elsewhere
  currentPersona = profile.user_type || profile.role || null;
  // Also, update the UI to show the correct AI form based on persona
  if (currentPersona === "athlete") {
      if (aiAthleteForm) aiAthleteForm.classList.remove("hidden");
      if (aiElderForm) aiElderForm.classList.add("hidden");
  } else if (currentPersona === "elder") {
      if (aiElderForm) aiElderForm.classList.remove("hidden");
      if (aiAthleteForm) aiAthleteForm.classList.add("hidden");
  }
}

// --- Initial app state based on auth ---
// Listen for Firebase Auth state and control the UI accordingly!
auth.onAuthStateChanged(async (user) => {
  clearMessages();
  console.log("Auth state changed. User:", user ? user.uid : "None");

  if (user) {
    currentUser = user;
    try {
        currentUserToken = await user.getIdToken();
        console.log("User logged in. Fetching profile...");

        userInfo.style.display = "block";
        userDisplayName.textContent = user.displayName || user.email || "User";

        const profile = await fetchUserProfile(user.uid);

        if (profile) {
            console.log("Profile found:", profile);
            populateProfileUI(profile);
            showSections(dashboardSection);
            await loadDashboardData(); // Load data once user is confirmed and profile populated
        } else {
            console.log("No profile found. Redirecting to onboarding.");
            showSections(onboardSection);
        }
    } catch (err) {
      console.error("Error during auth state change processing:", err);
      // If fetching token or profile fails, treat as if profile doesn't exist or an error occurred.
      // In a real app, you might want more granular error handling or a retry mechanism.
      showSections(onboardSection); // Fallback to onboarding or even auth if token invalid
    }
  } else {
    console.log("User logged out or no user.");
    // Not logged in: show auth section (register by default)
    currentUser = null;
    currentUserToken = null;
    currentPersona = null;

    userInfo.style.display = "none";
    userDisplayName.textContent = "";
    showSections(authSection);
    if (registerPanel) registerPanel.classList.remove("hidden");
    if (loginPanel) loginPanel.classList.add("hidden");
  }
});

console.log("Script loaded successfully");