// Your Firebase config (replace with your actual config from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyDrwJz-srfx9sl19P6CZ12wHJScUsdzzW8",
    authDomain: "stridesense-ac89e.firebaseapp.com",
    projectId: "stridesense-ac89e",
    storageBucket: "stridesense-ac89e.firebasestorage.app",
    messagingSenderId: "141261430054",
    appId: "1:141261430054:web:2dbe68242a9ed6d42af5e7",
    measurementId: "G-MFPRPHMZYE"
  };
  
  // Initialize Firebase (compat)
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  
  const registerSection = document.getElementById("register-section");
  const registerBtn = document.getElementById("register-btn");
  const regEmailInput = document.getElementById("reg-email");
  const regPasswordInput = document.getElementById("reg-password");
  const regNameInput = document.getElementById("reg-name");
  const registerMessage = document.getElementById("register-message");
  
  const loginSection = document.getElementById("login-section");
  const loginBtn = document.getElementById("login-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginMessage = document.getElementById("login-message");
  
  const activitySection = document.getElementById("activity-section");
  const addActivityBtn = document.getElementById("add-activity-btn");
  const activityTypeInput = document.getElementById("activity-type");
  const activityDurationInput = document.getElementById("activity-duration");
  const activityMessage = document.getElementById("activity-message");
  const activityList = document.getElementById("activity-list");
  
  const logoutBtn = document.getElementById("logout-btn");
  
  let currentUserToken = null;
  
  // Backend API base URL - change this if your backend URL is different
  const API_BASE_URL = "http://127.0.0.1:8000";
  
  // -------- Registration Logic --------
  registerBtn.addEventListener("click", () => {
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value;
    const name = regNameInput.value.trim();
    registerMessage.textContent = "";
    registerMessage.style.color = "red";
  
    if (!email || !password) {
      registerMessage.textContent = "Please enter email and password.";
      return;
    }
  
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        if (name) {
          user.updateProfile({ displayName: name });
        }
        registerMessage.style.color = "green";
        registerMessage.textContent = "Registration successful! You can now log in.";
        regEmailInput.value = "";
        regPasswordInput.value = "";
        regNameInput.value = "";
      })
      .catch(error => {
        registerMessage.textContent = error.message;
      });
  });
  
  // -------- Login Logic --------
  loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    loginMessage.textContent = "";
    loginMessage.style.color = "red";
  
    if (!email || !password) {
      loginMessage.textContent = "Please enter email and password.";
      return;
    }
  
    auth.signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        currentUserToken = await user.getIdToken();
  
        // Show activity section, hide login/register sections
        loginSection.style.display = "none";
        registerSection.style.display = "none";
        activitySection.style.display = "block";
  
        // Clear messages
        loginMessage.textContent = "";
        registerMessage.textContent = "";
  
        loadActivities();
      })
      .catch(error => {
        loginMessage.textContent = error.message;
      });
  });
  
  // -------- Logout Logic --------
  logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => {
      currentUserToken = null;
  
      loginSection.style.display = "block";
      registerSection.style.display = "block";
      activitySection.style.display = "none";
  
      emailInput.value = "";
      passwordInput.value = "";
      activityList.innerHTML = "";
      loginMessage.textContent = "";
      activityMessage.textContent = "";
    });
  });
  
  // -------- Activity Add Logic --------
  addActivityBtn.addEventListener("click", () => {
    activityMessage.textContent = "";
    activityMessage.style.color = "red";
  
    const type = activityTypeInput.value.trim();
    const duration = parseInt(activityDurationInput.value);
  
    if (!type || isNaN(duration) || duration <= 0) {
      activityMessage.textContent = "Please enter valid activity type and duration.";
      return;
    }
  
    const activity = {
      user_id: auth.currentUser.uid,
      timestamp: new Date().toISOString(),
      type: type,
      duration_minutes: duration,
    };
  
    fetch(`${API_BASE_URL}/data/activity/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentUserToken}`,
      },
      body: JSON.stringify(activity),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add activity");
        return res.json();
      })
      .then(() => {
        activityMessage.style.color = "green";
        activityMessage.textContent = "Activity added!";
        activityTypeInput.value = "";
        activityDurationInput.value = "";
        loadActivities();
      })
      .catch(err => {
        activityMessage.textContent = err.message;
      });
  });
  
  // -------- Load Activities from backend --------
  function loadActivities() {
    fetch(`${API_BASE_URL}/data/activity/?user_id=${auth.currentUser.uid}`, {
      headers: {
        "Authorization": `Bearer ${currentUserToken}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load activities");
        return res.json();
      })
      .then(data => {
        activityList.innerHTML = "";
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(act => {
            const li = document.createElement("li");
            li.textContent = `${act.type} for ${act.duration_minutes || "N/A"} mins at ${new Date(act.timestamp).toLocaleString()}`;
            activityList.appendChild(li);
          });
        } else {
          activityList.innerHTML = "<li>No activities found</li>";
        }
      })
      .catch(() => {
        activityList.innerHTML = "<li>Failed to load activities</li>";
      });
  }
  
  // On page load, check if user is already logged in (Firebase persist)
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUserToken = await user.getIdToken();
      loginSection.style.display = "none";
      registerSection.style.display = "none";
      activitySection.style.display = "block";
      loadActivities();
    } else {
      loginSection.style.display = "block";
      registerSection.style.display = "block";
      activitySection.style.display = "none";
      currentUserToken = null;
      activityList.innerHTML = "";
    }
  });
  