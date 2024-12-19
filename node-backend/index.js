const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 5001;

app.use(express.json());
let users = [];

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Check credential logic. This how the server will respond

  if ((username === "Test") & (password == "123")) {
    res.json({ success: true, message: "Login Successful" });
  } else {
    res.json({ success: false, message: "Invalid Credentials" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.json({ success: false, message: "Username already exists" });
  }

  try {
    hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });
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
