const { checkUser } = require("../services/auth");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const { request } = require("express");

const router = require("express").Router();

router.get("/addFriend", checkUser, (req, res) => {
    console.log("yo1")
    res.render("add", { user: req.user });
});

router.post("/addFriend", checkUser, async (req, res) => {
    console.log("Hellooooooo!!!!!!")
    const email = req.user.email;

    try {
        let { status, requester } = req.body;
        console.log("this has been posted", status, requester)

        //requester is not the person itself
        if (requester === req.user._id.toString()) {
            return res.status(400).send({
                status: "error",
                message: "You cannot send a friend request to yourself"
            });
        }

        //if they are already friend
        const userWithFriend = await user.findOne({
            email,
            friends: { $elemMatch: { friendID: requester } }
        });
        if (userWithFriend) {
            return res.status(400).send({
                status: "error",
                message: "This user is already your friend"
            });
        }


        const friendName = await user.findById({ _id: requester });
        if (!friendName) {
            return res.status(404).send({
                status: "error",
                message: "Requester not found"
            });
        }

        if (status == "accepted") {
            console.log("accepted??")
            console.log(requester)
            const friend = await user.findOneAndUpdate(
                { email },
                {
                    $push: { friends: { friendID: requester, friendName: friendName.name, acceptedStatus: true } },
                    $pull: { requests: { requestID: requester } }
                }
            );
            console.log(friend);
            await user.findByIdAndUpdate(
                { _id: requester },
                {
                    $push: { friends: { friendID: friend.id, friendName: req.user.name, acceptedStatus: true } }
                }
            );
            return res.send({
                status: "success",
                message: "Connection request accepted"
            });
        } else if (status == "rejected") {
            console.log("rejected!!")
            await user.findOneAndUpdate(
                { email },
                {
                    $pull: { requests: { requestID: requester } }
                }
            );
            return res.send({
                status: "success",
                message: "Connection request rejected"
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            status: "error",
            message: "An error occurred while processing the friend request"
        });
    }
});



module.exports = router;