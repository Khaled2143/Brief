import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticate from "./middleware/authenticate.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection Error:", err));

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  dislikedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Account = mongoose.model("Account", accountSchema);

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, default: Date.now },
});

const Discussion = mongoose.model("Discussion", discussionSchema);

const commentSchema = new mongoose.Schema(
  {
    discussionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
      required: true,
    },
    username: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

const summarySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  section: [
    {
      header: { type: String },
      content: { type: String },
    },
  ],
  createdAt: { type: String, default: Date.now },
});

const Summary = mongoose.model("Summary", summarySchema);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/summaries", async (req, res) => {
  const { title, section } = req.body;

  try {
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title must be provided to be a valid input.",
      });
    }

    if (!section) {
      return res.status(400).json({
        success: false,
        message: "Section must be provided to be a valid input.",
      });
    }
    if (!Array.isArray(section)) {
      return res.status(400).json({
        success: false,
        message: "Section must be an array containing headers and content.",
      });
    }
    await Summary.create({ title: title, section: section });
    return res.status(201).json({
      success: true,
      message: "Title and Section summaries have been successfully saved",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error please try again",
    });
  }
});

app.post("/api/discussions/:id/dislike", async (req, res) => {
  const { id: commentID } = req.params;
  const { userID } = req.body;

  try {
    const userExists = await Account.findById(userID);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Comment ID: Please ensure you are providing a vald MongoDB comment id (ObjectID)",
      });
    }

    const comment = await Comment.findById(commentID);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message:
          "This comment does not exist, please ensure a valid MongoDB ID is being provided (ObjectID)",
      });
    }

    if (userExists.dislikedComments.includes(commentID)) {
      return res.json({
        success: true,
        message: "Comment has already been disliked",
      });
    }

    await Account.updateOne(
      { _id: userID },
      {
        $pull: { likedComments: commentID },
        $addToSet: { dislikedComments: commentID },
      }
    );

    const dislikedComment = await Comment.findByIdAndUpdate(
      commentID,
      { $inc: { likes: -1 } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Like on comment has been decremented successfully",
      likes: dislikedComment.likes,
      dislikedComment,
    });
  } catch (error) {
    console.error("Internal Server Error: Please try again later");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/discussions/:id/like", async (req, res) => {
  const { id: commentID } = req.params;
  const { userID } = req.body;

  try {
    const userExists = await Account.findById(userID);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Comment ID: Please provide a valid MongoDB ObjectID",
      });
    }

    const comment = await Comment.findById(commentID);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message:
          "Comment does not exist please ensure a valid comment ID is being provided",
      });
    }

    if (userExists.likedComments.includes(commentID)) {
      return res.json({
        success: true,
        message: "Comment is already liked by this user",
      });
    }

    await Account.updateOne(
      { _id: userID },
      {
        $pull: { dislikedComments: commentID },
        $addToSet: { likedComments: commentID },
      }
    );

    const likedComment = await Comment.findByIdAndUpdate(
      commentID,
      { $inc: { likes: 1 } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Like count has been incremented",
      likes: likedComment.likes,
      likedComment,
    });
  } catch (error) {
    console.error("An internal server error occured:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occured, please try again.",
    });
  }
});
app.get("/api/users/:userID/active-discussions", async (req, res) => {
  const { userID } = req.params;

  try {
    const userExists = await Account.findById(userID);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please ensure you have made an account",
      });
    }
    // Find method requires filter a filter. Using UserID to track who made comment

    const userComments = await Comment.find({ username: userExists.username });
    console.log("userCommUSER COMMENEents", userComments);

    if (!userComments.length) {
      return res.status(200).json({
        success: true,
        activeDiscussions: [],
      });
    }

    // Gets rid of duplicate discussions, incase someone commented on a post multiple times

    const disucssionsIDs = [
      ...new Set(userComments.map((comment) => comment.discussionID)),
    ];

    //Finds disucssions where id, automatically generated by mongoDB, is in discussionID
    const activeDiscussions = await Discussion.find({
      _id: { $in: disucssionsIDs },
    });

    if (activeDiscussions.length === 0) {
      return res.status(200).json({
        success: true,
        activeDiscussions: [],
      });
    }

    return res.status(200).json({
      success: true,
      activeDiscussions,
    });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "SERVER SIDE ERROR PELASE TRY AGAIN",
    });
  }
});

app.patch(
  "/api/discussions/:discussionID/comments/:commentID",
  async (req, res) => {
    const { discussionID, commentID } = req.params;
    const { userID } = req.body;
    const { username, content } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(discussionID)) {
        return res.status(400).json({
          success: false,
          message:
            "Please ensure the objectID being provided is the same ID provided by MongoDB",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(commentID)) {
        return res.status(400).json({
          success: false,
          message:
            "Please ensure the objectID beign provided is the same ID provided by MongoDB",
        });
      }
      const discussionExists = await Discussion.findById(discussionID);
      const commentExists = await Comment.findOne({
        _id: commentID,
        discussionID,
      });
      const userExists = await Account.findById(userID);

      if (!discussionExists) {
        return res.status(404).json({
          success: false,
          message: "Discussion not found. Please provide valid discussionID",
        });
      }

      if (!commentExists) {
        return res.status(404).json({
          success: false,
          message: "Comment not found. Please provide valid commentID",
        });
      }

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message:
            "The provided userID does not correspond to an existing user. Please ensure the userID is correct.",
        });
      }

      if (commentExists.username !== username) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to edit this comment ",
        });
      }

      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Content is required to edit a comment",
        });
      }

      const updateComment = await Comment.findByIdAndUpdate(
        commentID,
        { content },
        { new: true }
      );
      return res.json({
        success: true,
        message: "The comment has been updated successfully ",
        updatedComment: updateComment,
      });
    } catch (error) {
      console.error("Error occured:", error);
      return res.status(500).json({
        success: false,
        message: "Server error occured: Please try again",
      });
    }
  }
);

app.get("/api/discussions/:id/comments", async (req, res) => {
  const { id: discussionID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(discussionID)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Disucssion ID: Please provide a valid MongoDB objectID for the discussion",
      });
    }

    const comments = await Comment.find({ discussionID });

    if (comments.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No comments were found: Please ensure the MongoDB objectID is correct",
      });
    }
    return res.json({
      success: true,
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/discussions/:id/comments", async (req, res) => {
  const { username, content } = req.body;
  const { id: discussionID } = req.params;
  console.log("Discussion ID:", discussionID);
  console.log("Request Body:", req.body);

  try {
    const discussion = await Discussion.findById(discussionID);
    if (!discussion) {
      return res.status(400).json({
        success: false,
        message:
          "Discusson was not found: Ensure the discussion ID corresponds to an existing discussion in the database",
      });
    }
    if (!username || !content) {
      return res.status(400).json({
        success: false,
        message: "Username and Content must both be provided",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(discussionID)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid discussion ID: Please provide a valid MongoDB ObjectID for the discussion",
      });
    }

    const comment = await Comment.create({ username, content, discussionID });
    return res.json({
      success: true,
      message: "Reply has been created",
      comment,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
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
    const userID = req.user.userID;
    console.log("Decoded userID:", userID);

    const user = await Account.findById(userID);
    console.log("User found in MongoDB:", user);

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
  console.log("Received payload:", req.body);

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
      message: "Failed to create discussion",
    });
  }
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
