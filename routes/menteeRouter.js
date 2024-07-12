const { checkUser } = require("../services/auth");
const userModel = require("../models/user");

const router = require("express").Router();

router.get("/new", checkUser, (req, res) => {
  res.render("mentee/new", { user: req.user });
});

router.post("/new", checkUser, async (req, res) => {
  try {
    const email = req.user.email
    await userModel.findOneAndUpdate({ email }, {
      isMentee: true

    });
    return res.status(200).json({
      status: "success",
      message: "Updated mentee profile",

    });
    return res.status(200).send("Mentee status updated");
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: "error",
      message: "Some error occurred. Please try again later.",
    });

  }
});

module.exports = router;