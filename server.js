const express = require("express");
const path = require("path");
const webRoutes = require("./routes/webRoutes");
require("dotenv").config();


const app = express();

app.get("/config.js", (req, res) => {
    // console.log(">>> Serving config.js with BACKEND_URL:", process.env.BACKEND_URL);    
    res.type("text/javascript");
    res.send(`
        window.APP_CONFIG = {
            BACKEND_URL: "${process.env.BACKEND_URL}"
        };
    `);
});


// Static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Page routes
app.use("/", webRoutes);

// Start server on 8081
app.listen(8081, () => {
    console.log("Frontend running at http://localhost:8081/home");
});
