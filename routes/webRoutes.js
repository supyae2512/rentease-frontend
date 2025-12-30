const path = require("path");
const express = require("express");
const router = express.Router();

// Authentication middleware
const requireAuth = (req, res, next) => {
    const token = req.cookies?.jwt;
    if (!token) {
        return res.redirect(`/signin?redirect=${req.originalUrl}`);
    }
    try {
        // const decoded = verifyToken(token); 
        // req.user = decoded;
        next(); // Continue to the route
    } catch (error) {
        console.error("Token verification failed:", error);
        res.redirect(`/signin?redirect=${req.originalUrl}`);
    }
};

router.post("/auth/store-token", express.urlencoded({ extended: false }), (req, res) => {
    console.log("Storing token in cookie:", req.body);

    res.cookie("jwt", req.body.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true only in HTTPS
        path: "/",
        maxAge: 60 * 60 * 1000 * 2 // 2 hour
    });
    console.log("Cookie set successfully", req.cookies);

    res.sendStatus(200);
});

router.get("/auth/status", (req, res) => {
    const isAuthenticated = Boolean(req.cookies?.jwt);
    res.json({ authenticated: isAuthenticated });
});

router.get("/auth/token", (req, res) => {
    const authToken = req.cookies?.jwt || null;
    res.json({ token: authToken });
});

router.post("/auth/logout", (req, res) => {
    res.clearCookie("jwt", { path: "/" });
    res.sendStatus(200);
});


router.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/home.html"));
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/home.html"));
});


// Property listing
router.get("/list-property", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/property-list.html"));
});

// Home -> Property listing
router.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/login.html"));
});

router.get("/add-property", requireAuth, (req, res) => {
    
    res.sendFile(path.join(__dirname, "..", "public/property-new.html"));
});


// Property detail page
router.get("/property/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/property-detail.html"));
});

router.get("/property/edit/:id", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/property-edit.html"));
});

// Login page (for advertiser posting)
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

module.exports = router;
