const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async(req,res)=>{
  try{
  const{ username , email , password }=req.body;
  const existinguser = await User.findOne({ email });
  if (existinguser) {
  return res.status(400).json({ message: "User Already Exists" });
       }
       const salt=await bcrypt.genSalt(10);
       const hashedPassword=await bcrypt.hash(password,salt);

       const newUser=new User({username,email,password:hashedPassword});
       await newUser.save();
       const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "5950h" });

       res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         maxAge: 7 * 24 * 60 * 60 * 1000
       }).status(200).json({ success: true, message: "Registration successful" });

  } catch(error){
      res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set in environment variables");
        return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).status(200).json({ message: "Login successful" });

} catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
}
};

const logoutUser = async (req, res) => {
try {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).status(200).json({ message: "Logout successful" });
} catch (error) {
  res.status(500).json({ message: "Server error" });
}
};





const guestUser = async (req, res) => {
    try {
        res.status(200).json({ message: "Guest access granted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

  const getCurrentUser = async (req, res) => {
    try {
      // Make sure to properly handle cases where user isn't found
      const user = await User.findById(req.user.userId).select('username email wpm');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Add proper CORS headers
      res.header("Access-Control-Allow-Origin", "http://localhost:5173")
         .header("Access-Control-Allow-Credentials", "true")
         .status(200)
         .json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.header("Access-Control-Allow-Origin", "http://localhost:5173")
         .header("Access-Control-Allow-Credentials", "true")
         .status(500)
         .json({ message: "Server error" });
    }
  };



const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username },
      { new: true }
    ).select('username email');
    
    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  guestUser,
  logoutUser,
  getCurrentUser, // Add this
  updateUsername  // Add this
};