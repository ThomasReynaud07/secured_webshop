require("dotenv").config({ path: "../.env" });

const { loginLimiter } = require("./middleware/limitRate");
const express = require("express");
const path = require("path");
const session = require("express-session");
const app = express();
const https = require("https");
const fs = require("fs");

//https
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
};

app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const flash = require("express-flash-messages");
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------
// Routes API (retournent du JSON)
// ---------------------------------------------------------------
const authRoute = require("./routes/Auth");
const profileRoute = require("./routes/Profile");
const adminRoute = require("./routes/Admin");
const verifyToken = require("./middleware/auth");
const isAdmin = require("./middleware/admin");

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoute);
app.use("/api/profile", verifyToken, profileRoute);
app.use("/api/admin", verifyToken, isAdmin, adminRoute);

// ---------------------------------------------------------------
// Routes pages (retournent du HTML)
// ---------------------------------------------------------------
const homeRoute = require("./routes/Home");
const userRoute = require("./routes/User");

app.use("/", homeRoute);
app.use("/user", userRoute);

app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "login.html")),
);
app.get("/register", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "register.html")),
);
app.get("/profile", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "profile.html")),
);
app.get("/admin", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "admin.html")),
);

// Démarrage du serveur
app.get("/test", (_req, res) => res.send("db admin: root, pwd : root"));
const PORT = 8080;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Serveur sécurisé lancé sur https://localhost:${PORT}`);
});
