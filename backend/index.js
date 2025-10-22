const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

// ✅ API routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
