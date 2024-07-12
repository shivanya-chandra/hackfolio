const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { checkUser } = require("../services/auth");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const chat = require("../models/chatModel");
const { mongo, default: mongoose } = require('mongoose');

const router = require("express").Router();

router.get("/chat", checkUser, async (req,res) => {
    const user = await userModel.findById(req.user._id);
    console.log(user.friends);
    console.log()
    res.render("messages", {friends: user.friends, userId: user._id.toString()});
})


router.get('/chat/:senderID/:receiverID', checkUser, async (req, res) => {
    const { senderID, receiverID } = req.params;
    console.log(senderID)
    console.log(req.user._id.toString())
    if (senderID != req.user._id) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    console.log(receiverID)
    // const receiverId = new mongoose.Types.ObjectId(receiverID);
    // const receiver = await user.findById(receiverId);
    // if (!receiver) {
    //     return res.status(404).json({ status: 'error', message: 'User not found' });
    // }
    const chats = await chat.find({ $or: [{ senderID: senderID, receiverID: receiverID }, { senderID: receiverID, receiverID: senderID }] });
    console.log(chats)
    res.render("chat", { chats, senderID, receiverID, senderName: req.user.name });
})

router.post('/chat', (req, res) => {
    const { receiverID, message } = req.body;

    const newMessage = new chat({
        senderID: req.body.senderID,
        receiverID: receiverID,
        message: message
    });

    newMessage.save()
        .then(() => res.json({ status: 'success', message: 'Message saved' }))
        .catch(err => res.status(500).json({ status: 'error', message: 'Failed to save message', error: err.message }));
});

module.exports = router;