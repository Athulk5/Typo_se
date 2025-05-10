const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { 
    registerUser, 
    loginUser, 
    guestUser,
    getCurrentUser,  
    updateUsername,
    logoutUser
  } = require("../Controllers/authcontroller");
const { updatewpm, getLeaderboard } = require("../Controllers/leaderboardController");  
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/guest", guestUser); 
router.post("/logout", logoutUser); 
router.post("/api/generate-text");

router.get("/me", verifyToken, getCurrentUser);
router.patch("/update-username", verifyToken, updateUsername);

module.exports = router;
