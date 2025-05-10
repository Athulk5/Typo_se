const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');



exports.verifyToken = (req, res, next) => {
    let token = req.cookies?.token;
    
    // (for API clients)
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