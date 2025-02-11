const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    req.user = user; // Attach user info to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};

module.exports = { verifyAdmin };
