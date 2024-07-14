const { checkUser } = require("../services/auth");
const user = require("../models/user");
const bcrypt = require("bcrypt");

const router = require("express").Router();

router.get("/profile", checkUser, (req, res) => {
    if (req.user) {
        res.render("profile", { user: req.user });
        console.log("hello from profile");
    } else {
        res.status(401).send("User not authenticated");
    }
    console.log("hello from profile")
});

router.get("delete", checkUser, (req, res) => {
    res.render("profile", { user: req.user });
    console.log("hello from delete")
})

router.post("/delete", checkUser, async (req, res) => {
    const email = req.user.email;

    try {
        const deletedUser = await user.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.send({
                status: "error",
                message: "User not found",
            });
        }

        return res.send({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            status: "error",
            message: "An error occurred. Please try again later.",
        });
    }
});

router.post("/profile", checkUser, async (req, res) => {
    try {
        let {
            name,
            // password,
            // password_new,
            level,
            major,
            year,
            minor,
            residency,
            state,
            country,
            gender,
            professional,
            interests,
        } = req.body;
        const email = req.user.email;

        const dbUser = await user.findOne({ email });
        if (!dbUser) {
            return res.status(404).send({
                status: "error",
                message: "User not found",
            });
        }

        // const isMatch = await bcrypt.compare(password, dbUser.password);
        // if (!isMatch) {
        //     return res.send({
        //         status: "error",
        //         message: "The passwords don't match",
        //     });
        // }

        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password_new, salt);
        if (country != "United States") {
            state = "international";
        }
        const majors = major.split(", ");
        const minors = minor.split(", ");
        const interestsList = interests.split(", ");

        await user.findOneAndUpdate(
            { email },
            {
                name,
                // password: hashedPassword,
                level,
                residency,
                state,
                country,
                gender,
                year,
                professional,
                major: majors,
                minor: minors,
                interests: interestsList,
                menteeProfileCreated: true,
            }
        );

        console.log(majors);
        console.log("Profile updated successfully");
        return res.send({
            status: "success",
            message: "Mentee profile updated successfully.",
        });
    } catch (err) {
        console.log(err);
        return res.send({
            status: "error",
            message: "Some error occurred. Please try again later.",
        });
    }
});

module.exports = router;
