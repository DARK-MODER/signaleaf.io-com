const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const User = require('./models/User'); // Define your User schema

const app = express();
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signaleaf', { useNewUrlParser: true, useUnifiedTopology: true });

// User routes
app.post('/upload-profile-pic', upload.single('profile-pic'), async (req, res) => {
    const userId = req.user.id; // Get user ID from authentication middleware
    const user = await User.findById(userId);
    user.profilePic = req.file.path;
    await user.save();
    res.status(200).json({ message: 'Profile picture updated successfully' });
});

app.post('/update-username', async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;
    const user = await User.findById(userId);
    user.username = username;
    await user.save();
    res.status(200).json({ message: 'Username updated successfully' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
