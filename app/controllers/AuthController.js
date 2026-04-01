const db = require("../config/db");
const bcrypt = require("bcrypt");

module.exports = {
  // ----------------------------------------------------------
  // POST /api/auth/login
  // ----------------------------------------------------------
  login: async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const query = `SELECT * FROM users WHERE username = ? `;

    db.query(query, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message, query: query });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }
      const user = results[0];
      const passwordPeper = password + process.env.SECRETKEY;
      const hashedpassword = await bcrypt.compare(passwordPeper, user.password);
      if (!hashedpassword) {
        return res.status(401).json({ error: "hasba" });
      }
      req.flash("success", "Connexion réussie");
      res.redirect("/");
    });
  },

  // ----------------------------------------------------------
  // POST /api/auth/register
  // ----------------------------------------------------------
  register: async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Email et Mot de passe requis" });
    }
    const passwordPeper = password + process.env.SECRETKEY;
    const hashedpassword = await bcrypt.hash(passwordPeper, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?) `;

    db.query(query, [username, email, hashedpassword], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message, query: query });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      res.redirect("/login");
    });
  },
};
