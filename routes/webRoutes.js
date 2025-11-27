const path = require("path");
const express = require("express");
const router = express.Router();


// Authentication middleware
const requireAuth = (req, res, next) => {
    const token = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.redirect("/signin");
    }
    
    try {
        // const decoded = verifyToken(token); 
        // req.user = decoded;
        next(); // Continue to the route
    } catch (error) {
        console.error("Token verification failed:", error);
        res.redirect("/signin");
    }
};

// Home -> Property listing
router.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/home.html"));
});

router.get("/list-property", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/property-list.html"));
});

// Home -> Property listing
router.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/login.html"));
});

router.get("/add-property", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/property-new.html"));
});


// Property detail page
router.get("/property/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/property-detail.html"));
});

// Login page (for advertiser posting)
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

module.exports = router;
