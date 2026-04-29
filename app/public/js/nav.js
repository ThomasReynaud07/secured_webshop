document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("topbar");
  if (!nav) return;

  const token = localStorage.getItem("monTokenJWT");
  let menuHtml = "";

  if (token) {
    // On décode le token pour lire le rôle
    const payload = JSON.parse(atob(token.split(".")[1]));

    menuHtml = `
      <a href="/">Accueil</a>
      <a href="/profile">Profil</a>
    `;

    // ESSENTIEL : On n'ajoute le lien Admin que si le rôle est 'admin'
    if (payload.role === "admin") {
      menuHtml += `<a href="/admin">Admin</a>`;
    }

    menuHtml += `<button id="logout-btn" class="btn-logout">Se déconnecter</button>`;
  } else {
    menuHtml = `
      <a href="/">Accueil</a>
      <a href="/login">Connexion</a>
      <a href="/register">Inscription</a>
    `;
  }

  nav.innerHTML = `
    <header class="topbar">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; min-height: 68px;">
            <a href="/" class="brand" style="text-decoration: none; font-weight: 700; font-size: 1.2rem; color: #1f2937;">Secure Shop</a>
            <nav class="menu" style="display: flex; align-items: center; gap: 1.2rem;">
                ${menuHtml}
            </nav>
        </div>
    </header>
  `;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("monTokenJWT");
      window.location.href = "/login";
    });
  }
});
