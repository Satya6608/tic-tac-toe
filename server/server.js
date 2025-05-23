const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http"); // Require the http module
const socketIo = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { connectToDatabase } = require("./utils/dbConnection");
const { handleSocketConnection } = require('./controllers/socketController');
const path = require("path");
const env = require("dotenv");

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
// app.use("/api", chatRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// Create an HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://tictactoesaty.netlify.app'] ,
    methods: ['GET', 'POST', 'PUT'] // Adjust the methods as needed
  }
});

handleSocketConnection(io)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  // app.use(express.static(path.join(__dirname1, "/client/.output/server")));

  // app.get("*", (req, res) =>
  //   res.sendFile(path.resolve(__dirname1, "client", ".output/server", "index.mjs"))
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
  // );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
