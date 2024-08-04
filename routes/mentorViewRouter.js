const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { checkUser } = require("../services/auth");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { mongo, default: mongoose } = require('mongoose');

const router = require("express").Router();

router.get('/mentor/:mentorID', checkUser, async (req, res) => {
    const user = await userModel.findById(req.user._id);

    const { mentorID } = req.params;
    const mentor = await userModel.findById(mentorID);
    console.log("this is mentor here", mentor.name)
    // res.send(`you are viewing ${mentor.name}`);
    res.render("mentorView", { mentor });

    // if (senderID != req.user._id) {
    //     return res.status(404).json({ status: 'error', message: 'User not found' });
    // }
    // console.log(receiverID)
    // const receiverId = new mongoose.Types.ObjectId(receiverID);
    // const receiver = await user.findById(receiverId);
    // if (!receiver) {
    //     return res.status(404).json({ status: 'error', message: 'User not found' });
    // }
    // const chats = await chat.find({ $or: [{ senderID: senderID, receiverID: receiverID }, { senderID: receiverID, receiverID: senderID }] });
    // console.log(chats)
    // res.render("messages", { friends: user.friends, chats, senderID, receiverID, senderName: req.user.name, userId: req.user._id.toString(), friend: friend });
});

module.exports = router;