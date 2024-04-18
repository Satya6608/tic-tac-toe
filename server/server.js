const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const { connectToDatabase } = require("./utils/dbConnection");
const env = require("dotenv")

env.config();
const app = express();
const PORT = process.env.PORT || 7000;

// Connect to the database
connectToDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});