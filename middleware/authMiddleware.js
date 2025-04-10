const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized user: No token provided" });
    }

    jwt.verify(token, 'SECRET_KEY', (err, email) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }        
        req.email = email;
        next();
    });
};

module.exports = {
    authMiddleware
}