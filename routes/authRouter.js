const router = require("express").Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { forwardUser, checkUser } = require("../services/auth");
const userModel = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.get("/register", forwardUser, (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  if (!name || !email || !password || !password2) {
    return res.send({
      status: "error",
      message: "Please enter all fields",
    });
  }
  if (password != password2) {
    console.log("yo");
    return res.send({
      status: "error",
      message: "Password does not match",
    });
  }
  // if (!email.endsWith("@purdue.edu")) {
  //   return res.send({
  //     status: "error",
  //     message: "Please use a purdue email",
  //   });
  // }
  user.findOne({ email }).then(async (dbUser) => {
    if (dbUser) {
      // return res.send({
      //     status: "error",
      //     message: "User with this email already exists"
      // })
      bcrypt.compare(password, dbUser.password).then((isMatch) => {
        if (isMatch) {

      

          const token = jwt.sign({ id: dbUser._id }, process.env.JWT_TOKEN);
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000 * 3,
          });
          return res.send({
            status: "success",
            message: "User exists and logging in!",
          });

        } else {
          return res.send({
            status: "error",
            message: "User exists but password is incorrect",
          });
        }
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const tempUser = {
        name,
        email,
        password: hashedPassword,
      };
      try {

        const emailToken = jwt.sign({ email }, process.env.JWT_TOKEN, {
          expiresIn: "1d",
        });
        const PORT = 3000 || process.env.PORT;
        const url = `https://boilerfind.onrender.com/auth/confirmation/${emailToken}`;
        
        await transporter.sendMail(
          {
            to: email,
            subject: "BoilerFind: Confirm Email",
            html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
          },
          (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              return res.send({
                status: "error",
                message: "Error sending confirmation email",
              });
            } else {
              console.log("Email sent:", info.response);
            }
          }
        );
        res.cookie("tempUser", JSON.stringify(tempUser), {
          httpOnly: true,
          maxAge: 86400000 * 3,
        });
        res.cookie("token", emailToken, {
          httpOnly: true,
          maxAge: 86400000 * 3,
        });
        // if(newUser.isConfirmed){
        //     await newUser.save();
        //     return res.send({
        //         status: "success",
        //         message: "Registered User"
        //     })
        // }
        return res.send({
          status: "notVerified",
          message: "Verify your mail first!",
        });
        return res.send({
          status: "success",
          message: "Registered User",
        });
        res.redirect("/verification");
      } catch (err) {
        console.log(err);
        return res.send({
          status: "error",
          message: "Some error occurred",
        });
      }
    }
  });
});

router.get("/confirmation/:token", forwardUser, async (req, res) => {
  try {
    const { email } = jwt.verify(req.params.token, process.env.JWT_TOKEN);
    const tempUserCookie = req.cookies.tempUser;
    if (tempUserCookie) {
      const tempUser = JSON.parse(tempUserCookie);
      if (tempUser.email === email) {
        const newUser = new user({
          name: tempUser.name,
          email: tempUser.email,
          password: tempUser.password,
          isConfirmed: true,
        });
        await newUser.save();
        res.clearCookie("tempUser");
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN);
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 86400000 * 3,
        });
        return res.redirect("/dashboard");
      }
    }
    return res.send({
      status: "error",
      message: "Invalid or expired token",
    });
  } catch (e) {
    return res.send({
      status: "error",
      message: "Invalid or expired token",
    });
  }
});

router.get("/verification", forwardUser, async (req, res) => {
  res.render("verification");
});



router.get("/login", forwardUser, (req, res) => {
  const redirect = req.query.redirect;
  res.render("login", { redirect });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({
      status: "error",
      message: "Please enter all fields",
    });
  }

  user
    .findOne({ email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.send({
          status: "error",
          message: "User does not exist",
        });
      }
      bcrypt.compare(password, dbUser.password).then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign({ id: dbUser._id }, process.env.JWT_TOKEN);
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000 * 3,
          });
          return res.send({
            status: "success",
          });
        } else {
          return res.send({
            status: "error",
            message: "Incorrect password",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.send({
        status: "error",
        message: "Some error occurred. Please try again later.",
      });
    });
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  req.user = null;
  return res.redirect("/auth/login");
});
router.get("/changePassword", checkUser, async (req, res) => {
  res.render("password");
})

router.post("/changePassword", checkUser, async (req, res) => {
  console.log("heyllo?")
  const {old, newPassword, confirm } = req.body;
  if (newPassword !== confirm) {
    return res.send({
      status: "error",
      message: "Passwords do not match"
    })
  }
  if(!old || !newPassword) {
    return res.send({
      status: "error",
      message: "Please enter all fields"
    })
  }
  const user = await userModel.findById(req.user.id);
  if(!user){
    return res.send({
      status: "error",
      message: "User not found"
    })
  }
  bcrypt.compare(old, user.password).then(async (isMatch) => {
    if(isMatch){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      return res.send({
        status: "success",
        message: "Password changed successfully"
      })
    } else {
      return res.send({
        status: "error",
        message: "Incorrect password"
      })
    }
  })

})

module.exports = router;
