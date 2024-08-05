require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const chat = require("./models/chatModel");
const cors = require('cors');

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "https://boilerfind-git-main-shivanyachandras-projects.vercel.app", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("view engine", "ejs");

app.use(cors()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')));

// Socket.IO setup
io.on('connection', (socket) => {
  console.log("a user connected");

  socket.on('user_connect', (data) => {
    console.log(`User connected with ID: ${data}`);
  });

  socket.on('chat message', (data) => {
    const { receiverID, message, senderID, senderName } = data;
    console.log(`Message received from ${senderID} to ${receiverID}: ${message}`);
    let totalmsg = {
      receiverID: receiverID,
      senderID: senderID,
      message: message,
      senderName: senderName
    };

    io.emit('chat message', totalmsg);
    const newMessage = new chat({
      senderID: senderID,
      receiverID: receiverID,
      message: message,
      senderName: senderName
    });

    newMessage.save().then(() => {
      console.log('message saved');
    }).catch(err => {
      console.error('Error saving message:', err);
    });
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

// Routes
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const menteeRouter = require("./routes/menteeRouter");
const mentorRouter = require("./routes/mentorRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const friendRouter = require("./routes/friendRouter");
const chatRouter = require("./routes/chatRouter");
const profileViewRouter = require("./routes/profileViewRouter");
const mentorViewRouter = require("./routes/mentorViewRouter");

app.use(indexRouter);
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/mentee", menteeRouter);
app.use("/mentor", mentorRouter);
app.use(requestRouter);
app.use(profileRouter);
app.use(friendRouter);
app.use(chatRouter);
app.use(profileViewRouter);
app.use(mentorViewRouter);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  console.log("connected to MongoDB");
  server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}).catch((err) => {
  console.log(err);
});
