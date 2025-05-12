const User = require("../models/user");

const updateWpm = async (req, res) => {
  try {
    const { wpm } = req.body;
    const userId = req.user.userId;

    const user = await User.findOneAndUpdate(
      { _id: userId, wpm: { $lt: wpm } }, // Only update if new WPM is higher
      { $set: { wpm: wpm } },
      { new: true }
    );

    if (user) {
      return res.status(200).json({ 
        message: "New high score saved!",
        wpm: user.wpm 
      });
    }

    res.status(200).json({ 
      message: "Score not higher than current record",
      wpm: (await User.findById(userId)).wpm 
    });
  } catch (err) {
    console.error("Error updating WPM:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ wpm: { $gt: 0 } }) // Only users with WPM > 0
      .sort({ wpm: -1 }) // Sort by WPM descending
      .limit(15) 
      .select("username wpm -_id"); 
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
      .header('Access-Control-Allow-Credentials', 'true')
      .status(200)
      .json(users);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { updateWpm, getLeaderboard };