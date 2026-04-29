const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // ----------------------------------------------------------
  // POST /api/auth/login
  // ----------------------------------------------------------
  login: async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Pseudo et mot de passe requis" });
    }

    const query = `SELECT * FROM users WHERE username = ?`;

    db.query(query, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message, query: query });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ error: "Pseudo ou mot de passe incorrect" });
      }

      const user = results[0];
      const passwordPeper = password + process.env.SECRETKEY;
      const isPasswordValid = await bcrypt.compare(
        passwordPeper,
        user.password,
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ error: "Pseudo ou mot de passe incorrect" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.SECRETKEY,
        { expiresIn: "24h" },
      );

      res.json({ message: "Connexion réussie", token: token });
    });
  },

  // ----------------------------------------------------------
  // POST /api/auth/register
  // ----------------------------------------------------------
  register: async (req, res) => {
    const { username, email, password } = req.body;

    // Correction du message d'erreur
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Pseudo, email et mot de passe requis" });
    }

    const passwordPeper = password + process.env.SECRETKEY;
    const hashedpassword = await bcrypt.hash(passwordPeper, 10);

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    db.query(query, [username, email, hashedpassword], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la création du compte",
          details: err.message,
        });
      }

      res.status(201).json({ message: "Compte créé avec succès" });
    });
  },
};
