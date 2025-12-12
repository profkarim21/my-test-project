// Simple frontend to interact with backend (assumes backend runs on http://localhost:3000)
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : `${window.location.protocol}//${window.location.host}`;

function setStatus(text, ok = true) {
  const el = document.getElementById("status");
  if (el) {
    el.textContent = text;
    el.style.color = ok ? "var(--success-color)" : "var(--error-color)";
    el.style.backgroundColor = ok ? "#eaf6ec" : "#fbe9e7";
  }
}

async function checkServer() {
  try {
    // Using a lightweight endpoint like GET / is better for a health check
    const res = await fetch(API_BASE);
    if (res.ok) {
      setStatus("Server is connected (GET / OK)", true);
    } else {
      setStatus(`Server returned an error: ${res.status}`, false);
    }
  } catch (e) {
    setStatus(`Connection error: ${e.message}`, false);
  }
}

async function loadUsers() {
  const el = document.getElementById("users-list");
  try {
    const res = await fetch(API_BASE + "/user");
    const data = await res.json();
    if (res.ok) {
      if (Array.isArray(data.Users)) {
        el.innerHTML = renderUsersTable(data.Users);
      } else {
        el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      }
    } else {
      el.innerHTML = `<i>Error loading users: ${res.status}</i>`;
    }
  } catch (e) {
    el.innerHTML = `<i>Fetch error: ${e.message}</i>`;
  }
}

function renderUsersTable(users) {
  if (!users || users.length === 0) return "<i>No users found.</i>";
  let html =
    '<table class="users-table"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Created At</th></tr></thead><tbody>';
  users.forEach((u) => {
    html += `<tr><td>${u.id || ""}</td><td>${u.name || ""}</td><td>${
      u.email || ""
    }</td><td>${new Date(u.createdAt).toLocaleString() || ""}</td></tr>`;
  });
  html += "</tbody></table>";
  return html;
}

function displayResult(elementId, data, error = false) {
  const el = document.getElementById(elementId);
  el.textContent = error ? `Error: ${data}` : JSON.stringify(data, null, 2);
}

// Single add
document.getElementById("single-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value.trim(),
  };
  const resultEl = "single-result";
  try {
    const res = await fetch(API_BASE + "/user/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    displayResult(resultEl, data);
    if (res.ok) {
      form.reset(); // Clear form on success
      await loadUsers(); // Refresh user list
    }
  } catch (e) {
    displayResult(resultEl, e.message, true);
  }
});

// Update user
document.getElementById("update-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    email: form.email.value.trim(),
    name: form.name.value.trim(),
    password: form.password.value.trim(),
  };

  // Filter out empty fields so we only send what needs to be updated
  const updatePayload = Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => value !== "")
  );

  const resultEl = "update-result";

  if (Object.keys(updatePayload).length <= 1 && updatePayload.email) {
    return displayResult(resultEl, "You must provide a new name or password to update.", true);
  }

  try {
    const res = await fetch(API_BASE + "/user", { // The endpoint is PUT /user
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
    const data = await res.json();
    displayResult(resultEl, data, !res.ok);
    if (res.ok) {
      form.reset(); // Clear form on success
      await loadUsers(); // Refresh user list
    }
  } catch (e) {
    displayResult(resultEl, e.message, true);
  }
});

// Initial setup and event listeners
document.addEventListener("DOMContentLoaded", () => {
  checkServer();
  loadUsers();
  document.getElementById("check-btn").addEventListener("click", checkServer);
  document.getElementById("load-users").addEventListener("click", loadUsers);
});
