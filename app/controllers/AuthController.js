const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // ----------------------------------------------------------
  // POST /api/auth/login
  // ----------------------------------------------------------
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Pseudo et mot de passe requis" });
    }

    const query = `SELECT * FROM users WHERE username = ?`;

    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error("Erreur login db:", err);
        return res
          .status(500)
          .json({ error: "Une erreur interne est survenue." });
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

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Pseudo, email et mot de passe requis" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    try {
      const passwordPeper = password + process.env.SECRETKEY;
      const hashedpassword = await bcrypt.hash(passwordPeper, 10);

      const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

      db.query(query, [username, email, hashedpassword], (err, results) => {
        if (err) {
          console.error("Erreur DB Register:", err);

          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Ce pseudo ou cet email est déjà utilisé." });
          }

          return res.status(500).json({
            error: "Une erreur est survenue lors de la création du compte.",
          });
        }

        res.status(201).json({ message: "Compte créé avec succès" });
      });
    } catch (error) {
      console.error("Erreur Hashage:", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  },
};
