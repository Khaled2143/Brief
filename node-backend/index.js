const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 5001;

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Khaled:SumthingWong2143@cluster0.gmutn.mongodb.net/myDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection Error:", err));

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, uniqye: true },
  password: { type: String, required: true },
});

const Account = mongoose.model("Account", accountSchema);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Check credential logic. This how the server will respond

  const userExists = await Account.findOne({ username });
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check credential logic. This how the server will respond

      const userExists = await Account.findOne({ username });
      if (!userExists) {
        return res.json({
          success: false,
          message: "Username does not exist",
        });
      }

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

      return res.json({ success: true, message: "Login Successful" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ success: false, message: "" });
    }
  });
  const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

  if (!isPasswordCorrect) {
    return res.json({
      success: false,
      message: "Password is incorrect",
    });
  }

  try {
    return res.json({ success: true, message: "Login Successful" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "" });
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

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
