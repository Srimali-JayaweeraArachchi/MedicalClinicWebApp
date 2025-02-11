const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");


// Load environment variables from .env file
dotenv.config();


// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
const DB_URL = 'mongodb+srv://djstsoftware260:djst1234@cluster0.aoihj.mongodb.net/';
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Load routes
const clinicalStaffRoutes = require("./routes/clinicalStaffRoutes");
const patientRoutes = require("./routes/patientRoutes");
//const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const billRoutes = require("./routes/billRoutes");
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

// Route Middleware
//app.use("/api/clinical-settings/clinical", clinicalSettingsRoutes);
app.use("/api/clinicalstaff", clinicalStaffRoutes);
app.use("/api/patients", patientRoutes);
//app.use("/api", appointmentRoutes);
app.use("/api", doctorRoutes);
app.use("/api/bills", billRoutes);
app.use('/api/auth', userRouter);
app.use('/api/admin', adminRouter);

// Example route for Doctor Dashboard
const authMiddleware = require('./middleware/authMiddleware');
app.get('/api/doctor/dashboard', authMiddleware(['Doctor']), async (req, res) => {
    try {
        const dashboardData = {
            totalAppointments: 0,
            totalPatients: 0,
            totalReports: 0,
        };
        res.json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

