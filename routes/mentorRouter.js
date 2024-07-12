const router = require("express").Router();
const userModel = require("../models/user");
const { checkUser, isMentor } = require("../services/auth");
const { findMentors } = require("../services/match");

router.post("/new", checkUser, async (req, res) => {
    try {
        const email = req.user.email;
        await userModel.findOneAndUpdate({ email }, { isMentor: true });
        res.status(200).send("You are now a mentor!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Some error occurred");
    }
});

router.get("/dashboard", checkUser, isMentor, async (req, res) => {
    const user = req.user;
    res.render("mentor/dashboard", { user });
});

router.get("/get", checkUser, async (req, res) => {
    try {
        // console.log("over here")
        const email = req.user.email;
        const user = await userModel.findOne({ email });
        const mentorIds = await findMentors(user);
        const mentors = [];
        for (let i = 0; i < mentorIds.length; i++) {
            let mentor = await userModel.findById(mentorIds[i][0]);
            mentors.push(mentor);
        }
        console.log(mentors)
        return res.status(200).send({ mentors });
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Some error occurred");
    }
})


module.exports = router;

