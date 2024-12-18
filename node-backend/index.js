const express = require("express");
const app = express();
const PORT = 5001;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
