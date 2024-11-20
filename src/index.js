const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

app.use(express.json());

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
  email:{
    type:String,
    required:true,
    unique:true,
    match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
});

// User Model
const User = mongoose.model("User", userSchema);

// Routes
// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate input fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Name, email, password, and confirm password are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Check if email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    // Create and save the new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error saving user to the database." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });

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
