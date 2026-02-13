require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

/* Root test */
app.get("/", (req, res) => {
    res.send("Backend running 🚀");
});

/* Step 1: Redirect user to Lightspeed login */
app.get("/auth/lightspeed", (req, res) => {

    const authUrl =
        `https://lightspeedapis.com/resto/oauth/authorize` +
        `?response_type=code` +
        `&client_id=${process.env.LS_CLIENT_ID}` +
        `&redirect_uri=${process.env.LS_REDIRECT_URI}`;

    res.redirect(authUrl);
});


/* Step 2: Handle callback + exchange code for token */
app.get("/auth/lightspeed/callback", async (req, res) => {

    const code = req.query.code;

    if (!code) {
        return res.status(400).send("No authorization code provided.");
    }

    try {

        const tokenResponse = await axios.post(
            "https://lightspeedapis.com/resto/oauth/access_token",
            {
                grant_type: "authorization_code",
                client_id: process.env.LS_CLIENT_ID,
                client_secret: process.env.LS_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.LS_REDIRECT_URI
            }
        );


        const accessToken = tokenResponse.data.access_token;
        console.log("Full token response:", tokenResponse.data);

        console.log("Access token received:", accessToken);

        /* Step 3: Test calling Lightspeed API */
        const apiResponse = await axios.get(
            "https://lightspeedapis.com/resto/rest/core/company/",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        console.log("Company data:", apiResponse.data);

        res.send("OAuth successful and API call worked ✅");

    } catch (error) {

        console.error("OAuth error:", error.response?.data || error.message);
        res.status(500).send("OAuth failed. Check logs.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
