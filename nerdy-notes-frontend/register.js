function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast");

    /* REMOVE OLD TOASTS */
toastContainer.innerHTML = "";

  const toast = document.createElement("div");
  toast.classList.add("toast-message");

  if (type === "success") {
    toast.classList.add("toast-success");
  } else {
    toast.classList.add("toast-error");
  }

  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

async function registerUser() {
  const btn = document.getElementById("registerBtn");

  btn.disabled = true;
  btn.innerText = "Creating •••";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  /* EMPTY CHECK */

  if (!name || !email || !password || !confirmPassword) {
    showToast("Please fill all fields", "error");
    btn.disabled = false;
    btn.innerText = "Create Account";
    return;
  }

  if(name.length > 15){
  showToast("Username must be under 15 characters","error");
  btn.disabled = false;
  btn.innerText = "Create Account";
  return;
}

// Name without spacing

const usernamePattern = /^[a-zA-Z0-9]+$/;

if (!usernamePattern.test(name)) {
  showToast("Username can only contain letters and numbers (no spaces)", "error");
  btn.disabled = false;
  btn.innerText = "Create Account";
  return;
}

  /* EMAIL VALIDATION */

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showToast("Enter a valid email", "error");
    btn.disabled = false;
    btn.innerText = "Create Account";
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    btn.disabled = false;
    btn.innerText = "Create Account";
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    btn.disabled = false;
    btn.innerText = "Create Account";
    return;
  }

  try {
    const response = await fetch("https://nerdy-notes-backend.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    /* ERROR FROM SERVER */

    if (!response.ok) {
      showToast(data.message || "Registration failed", "error");
      btn.disabled = false;
      btn.innerText = "Create Account";
      return;
    }

    /* SUCCESS */

    showToast("Account created successfully", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    showToast("Server error", "error");

    btn.disabled = false;
    btn.innerText = "Create Account";
  }
}

function togglePassword(id, icon) {
  const input = document.getElementById(id);
  const eyeIcon = icon.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}

/* PREVENT SPACES IN USERNAME */
const nameInput = document.getElementById("name");

if (nameInput) {
  nameInput.addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
  });
}

