require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Backend running 🚀");
});

app.get("/auth/lightspeed/callback", (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("No auth code provided");
    }

    res.send("Auth code received: " + code);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
