const db = require("../config/db");

module.exports = {
  // ----------------------------------------------------------
  // POST /api/auth/login
  // ----------------------------------------------------------
  login: (req, res) => {
    console.log(req);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message, query: query });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      //res.json({ message: "Connexion réussie", user: results[0] });
      res.redirect("/");
      req.flash("success", "Connexion réussie");
    });
  },

  // ----------------------------------------------------------
  // POST /api/auth/register
  // ----------------------------------------------------------
  register: (_req, res) => {
    res.status(501).json({ error: "Non implémenté — TODO exercice 7" });
  },
};
