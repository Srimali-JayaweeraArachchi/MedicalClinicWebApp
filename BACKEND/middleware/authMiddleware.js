const jwt = require('jsonwebtoken');


const authMiddleware = (roles) => (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = {
            id: decoded.userId,
            role: decoded.role,
            fullName: decoded.name,
        };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = authMiddleware
