const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

// Make sure this is used before your routes in server.js
// app.use(cookieParser());

exports.verifyToken = (req, res, next) => {
    // First try cookies (for web)
    let token = req.cookies?.token;
    
    // Fallback to Authorization header (for API clients)
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Access denied - no token provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: verified.userId };
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(400).json({ message: "Invalid Token" });
    }
};