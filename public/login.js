const users = {
  "Supercheese": process.env.SUPERCHEESE_PASS,
  "DGreatOOOOZZZZ": process.env.DGOZ_PASS,
  "Challito": process.env.CHALLITO_PASS,
  "Menudo": process.env.MENUDO_PASS,
  "Jeff": process.env.JEFF_PASS,
  "Redbanana": process.env.REDBANANA_PASS,
  "Spartacus": process.env.SPARTACUS_PASS,
  "Arby": process.env.ARBY_PASS,
  "Harovo": process.env.HAROVO_PASS,
  "Mater": process.env.MATER_PASS
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
