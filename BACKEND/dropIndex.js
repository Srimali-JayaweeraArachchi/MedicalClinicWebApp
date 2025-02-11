const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("MongoDB connected");

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop the username index
    try {
        await usersCollection.dropIndex('username_1'); // Specify the index name
        console.log("Username index dropped successfully");
    } catch (error) {
        console.error("Error dropping index:", error);
    } finally {
        mongoose.connection.close(); // Close the connection
    }
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});
