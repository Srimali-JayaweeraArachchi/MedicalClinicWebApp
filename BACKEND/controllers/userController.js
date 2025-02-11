const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const dotenv = require('dotenv');

dotenv.config();

const { JWT_SECRET } = process.env;


// Controller for logging in
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ message: "User not found for the specified role" });
        }

        // Check if the user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked. Please contact admin." });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        /*const jwtToken = jwt.sign(
            { userId: user._id, role: user.role }, // Add any relevant user info to the payload
            JWT_SECRET, 
            { expiresIn: '1h' } // Set token expiration time
        );

        // Send the token in the response
        res.status(200).json({ token: jwtToken, role: user.role });
    } */
        const token = jwt.sign({ userId: user._id, role: user.role, name: user.fullName }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token, role: user.role, name: user.fullName, message: "Login successful" });
    } 
        catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// Middleware for authorization
const authMiddleware = (roles) => (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.user = decoded; // Pass user data to the next middleware
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

exports.authMiddleware = authMiddleware;


// Controller for signing up
exports.signup = async (req, res) => {
    try {
        const { 
            fullName, 
            email, 
            phoneNumber, 
            password, 
            role, 
            medicalLicenseNumber, 
            specialization, 
            yearsOfExperience, 
            availableDays, 
            availableTimes 
        } = req.body;

        // Log payload
        console.log("Signup Payload:", req.body);

        // Validate role-specific fields
        if (role === 'Doctor') {
            if (!medicalLicenseNumber || !specialization || !yearsOfExperience || !availableDays || !availableTimes) {
                return res.status(400).json({
                    message: "Missing required fields for Doctor role",
                });
            }
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            medicalLicenseNumber: role === 'Doctor' ? medicalLicenseNumber : undefined,
            specialization: role === 'Doctor' ? specialization : undefined,
            yearsOfExperience: role === 'Doctor' ? yearsOfExperience : undefined,
            availableDays: role === 'Doctor' ? availableDays : undefined,
            availableTimes: role === 'Doctor' ? availableTimes : undefined,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};
