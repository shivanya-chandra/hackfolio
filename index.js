require("dotenv").config();
const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const partials = require("express-partials");
const chat = require("./models/chatModel");

const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set("view engine", "ejs");

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "/public")));
app.use(
  express.static("public", {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".ttf")) {
        res.set("Content-Type", "font/ttf");
      }
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(partials());
app.use(
  "/socket.io",
  express.static(
    path.join(__dirname, "node_modules", "socket.io", "client-dist")
  )
);

// Socket.IO setup
io.on("connection", (socket) => {
  let userID = "";

  console.log("a user connected");

  socket.on("user_connect", (data) => {
    userID = data.id;
  });

  socket.on("chat message", (data) => {
    const { receiverID, message, senderID, senderName } = data;
    console.log(data);
    let totalmsg = {
      receiverID: receiverID,
      senderID: senderID,
      message: message,
      senderName: senderName,
    };

    io.emit("chat message", totalmsg);
    console.log(senderID);
    const newMessage = new chat({
      senderID: senderID,
      receiverID: receiverID,
      message: message,
      senderName: senderName,
    });
    console.log(newMessage);

    newMessage
      .save()
      .then(() => {
        console.log("message saved");
      })
      .catch((err) => {
        console.error("Error saving message:", err);
      });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

// Routes
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const dashboardRouter = require("./routes/dashboardRouter");
menteeRouter = require("./routes/menteeRouter");
mentorRouter = require("./routes/mentorRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const helloRouter = require("./routes/helloRouter");
const friendRouter = require("./routes/friendRouter");
const chatRouter = require("./routes/chatRouter");

app.use(indexRouter);
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/mentee", menteeRouter);
app.use("/mentor", mentorRouter);

app.use(requestRouter);
app.use(profileRouter);
app.use(friendRouter);
app.use(chatRouter);

const PORT = process.env.PORT || 8080;
const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb+srv://aayanagarwal05:${process.env.MONGO_PASS}@cluster0.ipsboy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
