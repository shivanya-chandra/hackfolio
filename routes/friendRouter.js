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
    // console.log("this is the email of the person accepting the re",email)
    try {
        let {
            status,
            requester
        } = req.body;
        console.log("this has been posted", status, requester)
        const friendName = await user.findById({ _id: requester })
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
        console.log(e)
    }
})


module.exports = router;