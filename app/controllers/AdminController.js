const db = require("../config/db");

module.exports = {
  // ----------------------------------------------------------
  // GET /api/admin/users
  // ----------------------------------------------------------
  getUsers: (_req, res) => {
    db.query(
      "SELECT id, username, email, role, address FROM users",
      (err, results) => {
        if (err) {
          return res.status(500).json({
            error:
              "Impossible de récupérer la liste des utilisateurs pour le moment.",
          });
        }
        res.json(results);
      },
    );
  },
};
