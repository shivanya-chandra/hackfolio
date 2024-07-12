const { checkUser } = require("../services/auth");
const user = require("../models/user");

const router = require("express").Router();

router.get("/hello", checkUser, (req, res) => {
    res.send("hello what's up")
});


module.exports = router;
