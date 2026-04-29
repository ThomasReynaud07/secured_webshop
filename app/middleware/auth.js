// =============================================================
// Middleware d'authentification
// =============================================================

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Accès non autorisé. Token manquant." });
  }

  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide ou expiré." });
    }

    req.user = user;

    next();
  });
};
