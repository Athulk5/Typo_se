const express = require("express");
const { updateWpm, getLeaderboard } = require("../Controllers/leaderboardController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/update-wpm", verifyToken, updateWpm);
router.get('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  }, getLeaderboard);

module.exports = router;