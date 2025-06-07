const users = {
  "Supercheese": "hentai",
  "DGreatOOOOZZZZ": "pass36",
  "Challito": "red01",
  "Menudo": "it",
  "Jeff": "260",
  "Redbanana": "bandit",
  "Spartacus": "spartacus",
  "Arby": "meat",
  "Harovo": "green",
  "Mater": "truck"
};

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (users[username] && users[username] === password) {
    // Store username for session tracking
    localStorage.setItem("loggedInUser", username);

    // Redirect to player's stats page using lowercase for sheet name
    window.location.href = `players/player.html?sheet=${username.toLowerCase()}`;
  } else {
    // Show error if credentials are incorrect
    document.getElementById("error").style.display = "block";
  }
});
