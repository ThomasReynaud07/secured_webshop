const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    error:
      "Trop de tentatives de connexion. Veuillez réessayer dans une minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
