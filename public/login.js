document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch("/.netlify/functions/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const result = await res.json();

  if (result.success) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = `players/player.html?sheet=${username.toLowerCase()}`;
  } else {
    document.getElementById("error").style.display = "block";
  }
});

