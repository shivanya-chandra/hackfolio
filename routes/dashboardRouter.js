const router = require("express").Router();
const { checkUser } = require("../services/auth");
const userModel = require("../models/user");

router.get("/", checkUser, (req, res) => {
  res.render("dashboard", { user: req.user });
});
router.get("/new", checkUser, (req, res) => {
  res.render("new", { user: req.user });
});

router.post("/new", checkUser, async (req, res) => {
  try {
    let {
      level,
      major,
      college,
      year,
      minor,
      residency,
      state,
      country,
      gender,
      professional,
      interests,
      mentee,
      mentor,
    } = req.body;
    const email = req.user.email;
    if (country != "United States") {
      state = "international";
    }
    const majors = major.split(", ");
    const minors = minor.split(", ");
    const interestsList = interests.split(", ");
    await userModel.findOneAndUpdate(
      { email },
      {
        level,
        residency,
        college,
        state,
        year,
        country,
        gender,
        professional,
        major: majors,
        minor: minors,
        interests: interestsList,
        profileCreated: true,
        isMentee: mentee,
        isMentor: mentor,
      }
    );


    const dbUser = await userModel.findOneAndUpdate(
      { email },
      { major: majors, minor: minors, interests: interestsList }
    );

    return res.json({

      status: "success",
      message: "Profile created successfully.",
    });
  } catch (err) {

    console.error("Error creating profile:", err);
    return res.status(500).json({

      status: "error",
      message: "Some error occurred. Please try again later.",
    });
  }
});

router.get("/search", checkUser, async (req, res) => {
  res.render("search", { user: req.user });
})

module.exports = router;
