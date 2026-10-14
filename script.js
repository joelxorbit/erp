/**
 * St. Joseph's College (Autonomous) - Student ERP Portal
 * Pure HTML, CSS, JavaScript Logic
 */

// Target Authorized Credentials
const AUTH_CONFIG = {
  username: "bastin",
  password: "mongodb"
};

// Available Zip Packages
const ZIP_FILES = [
  { name: "set1.zip", label: "Set 1 Package" },
  { name: "set2.zip", label: "Set 2 Package" },
  { name: "set3.zip", label: "Set 3 Package" },
  { name: "set4.zip", label: "Set 4 Package" }
];

// DOM Elements
const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginCard = document.getElementById("loginCard");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginAlert = document.getElementById("loginAlert");
const loginBtn = document.getElementById("loginBtn");
const btnText = loginBtn.querySelector(".btn-text");
const btnSpinner = loginBtn.querySelector(".btn-spinner");
const displayUsername = document.getElementById("displayUsername");
const welcomeName = document.getElementById("welcomeName");
const dashNotification = document.getElementById("dashNotification");

// Check existing session on load
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = sessionStorage.getItem("sjc_erp_user");
  if (savedUser) {
    showDashboard(savedUser);
  }
});

/**
 * Handle Login Form Submission
 */
function handleLogin(event) {
  event.preventDefault();

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  // Reset alert
  hideAlert();

  // Validate credentials
  if (
    enteredUsername.toLowerCase() === AUTH_CONFIG.username.toLowerCase() &&
    enteredPassword === AUTH_CONFIG.password
  ) {
    // Show loading state
    setLoading(true);
    showAlert("success", "✓ Credentials verified. Welcome, " + enteredUsername + "!");

    // Save session
    sessionStorage.setItem("sjc_erp_user", enteredUsername);

    // Transition smoothly to dashboard
    setTimeout(() => {
      setLoading(false);
      showDashboard(enteredUsername);
    }, 700);

  } else {
    // Show error alert and shake card
    triggerShake();
    showAlert("error", "Invalid username or password. Please try again.");
    passwordInput.value = "";
    passwordInput.focus();
  }
}

/**
 * Trigger visual shake feedback for invalid credentials
 */
function triggerShake() {
  loginCard.classList.remove("shake");
  void loginCard.offsetWidth; // Force reflow
  loginCard.classList.add("shake");
  setTimeout(() => {
    loginCard.classList.remove("shake");
  }, 500);
}

/**
 * Show alert inside login card
 */
function showAlert(type, message) {
  loginAlert.className = `alert-box alert-${type}`;
  loginAlert.textContent = message;
  loginAlert.classList.remove("hidden");
}

function hideAlert() {
  loginAlert.classList.add("hidden");
  loginAlert.textContent = "";
}

/**
 * Toggle Button Loading Spinner
 */
function setLoading(isLoading) {
  if (isLoading) {
    loginBtn.disabled = true;
    btnText.textContent = "Authenticating...";
    btnSpinner.classList.remove("hidden");
  } else {
    loginBtn.disabled = false;
    btnText.textContent = "Login";
    btnSpinner.classList.add("hidden");
  }
}

/**
 * Switch from Login view to Dashboard
 */
function showDashboard(username) {
  displayUsername.textContent = username;
  welcomeName.textContent = username.charAt(0).toUpperCase() + username.slice(1);

  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  window.scrollTo(0, 0);

  showDashToast("Authentication verified: 4 ZIP packages ready for download.", "toast-success");
}

/**
 * Handle Logout
 */
function handleLogout() {
  sessionStorage.removeItem("sjc_erp_user");
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  
  // Clear inputs & alerts
  usernameInput.value = "";
  passwordInput.value = "";
  hideAlert();
  window.scrollTo(0, 0);
}

/**
 * Handle "Forgot Password?" click
 */
function handleForgotPassword(event) {
  event.preventDefault();
  alert("Notice:\nPassword reset requests must be submitted directly to the JCICT-ERP Office with your valid Student ID Card.");
}

/**
 * Download Tracker Toast
 */
function trackDownload(fileName) {
  showDashToast(`Starting download: ${fileName}...`, "toast-info");
}

/**
 * Download All ZIP files sequentially
 */
function downloadAllFiles() {
  showDashToast("Initiating batch download of all 4 ZIP archives...", "toast-info");

  ZIP_FILES.forEach((file, index) => {
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = file.name;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (index === ZIP_FILES.length - 1) {
        setTimeout(() => {
          showDashToast("✓ All 4 packages successfully queued for download!", "toast-success");
        }, 500);
      }
    }, index * 400); // 400ms delay between files to avoid browser popup blocks
  });
}

/**
 * Dashboard Toast Notification helper
 */
let toastTimeout;
function showDashToast(message, type = "toast-info") {
  clearTimeout(toastTimeout);
  dashNotification.className = `dash-toast ${type}`;
  dashNotification.textContent = message;
  dashNotification.classList.remove("hidden");

  toastTimeout = setTimeout(() => {
    dashNotification.classList.add("hidden");
  }, 4500);
}
