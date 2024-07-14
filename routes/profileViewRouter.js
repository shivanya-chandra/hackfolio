const { checkUser } = require("../services/auth");
const user = require("../models/user");
const bcrypt = require("bcrypt");

const router = require("express").Router();

router.get("/profileView", checkUser, (req, res) => {
    if (req.user) {
        res.render("profileView", { user: req.user });
        console.log("hello from profile");
    } else {
        res.status(401).send("User not authenticated");
    }
});

module.exports = router;
