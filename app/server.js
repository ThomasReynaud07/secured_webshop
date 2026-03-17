const express = require("express");
const path = require("path");

const app = express();
const userRoute = require("./routes/User");
const homeRoute = require("./routes/Home");

app.use(express.static(path.join(__dirname, "public")));
app.use("/", homeRoute);
app.use("/user", userRoute);

// Démarrage du serveur
app.listen(8080, () => {
    console.log("Server running on port 8080");
});