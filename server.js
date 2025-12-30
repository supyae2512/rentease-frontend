const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const webRoutes = require("./routes/webRoutes");
require("dotenv").config();

const app = express();

app.use(cookieParser()); // MUST be before routes
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

app.get("/config.js", (req, res) => {
    // console.log(">>> Serving config.js with BACKEND_URL:", process.env.BACKEND_URL);    
    res.type("text/javascript");
    res.send(`
        window.APP_CONFIG = {
            BACKEND_URL: "${process.env.BACKEND_URL}"
        };
    `);
});


// Page routes
app.use("/", webRoutes);

// Start server on 8081
app.listen(8081, () => {
    console.log("Frontend running at http://localhost:8081/home");
});
