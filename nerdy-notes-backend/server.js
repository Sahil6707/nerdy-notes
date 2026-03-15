const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const notesRoutes = require("./routes/notesRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const adminRoutes = require("./routes/adminRoutes");


const path = require("path");
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();

app.get("/", (req, res) => {
  res.send("Backend is alive");
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/admin", adminRoutes);

app.get("/test", (req, res) => {
  res.send("Server working");
});

app.get("/", (req, res) => {
  res.send("Nerdy Notes API Running");
});
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/protected", authMiddleware, (req, res) => {

  res.json({
    message: "You accessed a protected route",
    user: req.user
  });

});