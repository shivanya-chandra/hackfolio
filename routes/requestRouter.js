const { checkUser } = require("../services/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const router = require("express").Router();

router.get('/sendReq', checkUser, (req, res) => {
    console.log("GET request received at /sendReq");
    res.render("friend", { user: req.user });
});

router.post('/sendReq', checkUser, async (req, res) => {
    console.log("POST request received at /sendReq");
    console.log("Request body:", req.body);

    const { receiverEmail } = req.body;
    const friendId = await User.findOne({ email: receiverEmail });
    console.log("Receiver email:", receiverEmail);
    const email = req.user.email;

    if (receiverEmail === email) {
        console.log("Cannot send request to self");
        return res.send({
            status: "error",
            message: "Cannot send request to self"
        });
    }

    try {
        const reqId = await User.findOne({ email });
        console.log("Current user email:", email);
        console.log("Requesting user:", reqId);

        if (!reqId) {
            console.log("Cannot find user with email:", email);
            return res.send({
                status: "error",
                message: "Cannot find a user with that email"
            });
        }

        const isFriend = reqId.friends.some(friend => friend.friendID.toString() === friendId._id.toString());

        if (isFriend) {
            console.log("You are already connections with this user");
            return res.send({
                status: "error",
                message: "You are already connections with this user"
            });
        } else {
            const updateResult = await User.findOneAndUpdate(
                { email: receiverEmail },
                {
                    $push: {
                        requests: {
                            requestID: reqId._id,
                            requestSender: email,
                            status: 'pending'
                        }
                    }
                }
            );
            console.log("Update result:", updateResult);
            return res.send({
                status: "success",
                message: "Connection request sent successfully"
            });
        }
    } catch (error) {
        console.error("Error during the connection request process:", error);
        return res.send({
            status: "error",
            message: "An error occurred while sending the connection request"
        });
    }
});


module.exports = router;
