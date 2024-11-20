const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/LoginSignup", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("Failed to Connect to MongoDB:", err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
});

// User Model
const User = mongoose.model("User", userSchema);

// Routes
// Signup Route
app.post("/signup", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required." });
  }

  try {
    const newUser = new User({ name, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error saving user to the database." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required." });
  }

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    res.status(200).json({ message: "Login successful." });
  } catch (err) {
    res.status(500).json({ error: "Error during login process." });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
});

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});