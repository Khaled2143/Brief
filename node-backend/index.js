const express = require("express");
const bcrypt = require("bcryptjs");
const authenticate = require("./middleware/authenticate");
require("dotenv").config();
const app = express();
const PORT = 5001;

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection Error:", err));

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Account = mongoose.model("Account", accountSchema);

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Discussion = mongoose.model("Discussion", discussionSchema);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const userExists = await Account.findOne({ username });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Username does not exist",
      });
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );
    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Password is incorrect",
      });
    }
    const token = jwt.sign({ userID: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Successful login
    return res.json({ success: true, token, message: "Login Successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log("Checking username:", username);

  const isValid = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/.test(password);

  const userExists = await Account.findOne({ username });
  console.log("Query Result:", userExists);

  if (!isValid) {
    return res.json({
      success: false,
      message: "Password does not meet the requirements",
    });
  }

  if (userExists) {
    return res.json({ success: false, message: "Username already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    Account.create({ username, password: hashedPassword });
    res.json({ success: true, message: "Account has been created" });
  } catch (error) {
    console.error("Error hashing passwords", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/user/username", authenticate, async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await Account.findById(userID);

    if (!user) {
      return res.json({ success: false, message: "Username does not exist" });
    } else {
      return res.json({
        success: true,
        message: "Username Exists",
        data: user.username,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occured while retrieving the username",
    });
  }
});

app.get("/api/discussions", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items
  const skip = (page - 1) * limit; // Skip discussions from previous pages

  try {
    const totalDiscussions = await Discussion.countDocuments();

    const discussionData = await Discussion.find()
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .skip(skip);

    res.json({
      success: true,
      message: "Discussions retrieved successfully",
      data: discussionData,
      currentPage: page,
      totalPages: Math.ceil(totalDiscussions / limit),
    });
  } catch (error) {
    console.error("Error retrieving disucssions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve discussions" });
  }
});

app.post("/api/discussions", async (req, res) => {
  const { title, content, author, createdAt } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and Content must both be filled in",
    });
  }

  try {
    const newDiscussion = await Discussion.create({
      title,
      content,
      author,
      createdAt,
    });

    res.json({
      success: true,
      message: "Discussion created successfully",
      data: newDiscussion,
    });
  } catch (error) {
    console.error("Error creating disucssions:", error);
    res.status(500).json({
      success: false,
      messae: "Failed to create discussion",
    });
  }
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
