const user = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  checkUser: async (req, res, next) => {
    const token = req.cookies.token;
    const originalUrl = req.originalUrl;
    console.log(originalUrl);
    if (!token) {
      return res.redirect("/auth/login?redirect=" + originalUrl);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      const savedUser = await user.findById(decoded.id);

      if (!savedUser) {
        return res.redirect("/auth/login?redirect=" + originalUrl);
      }
      req.user = savedUser;
      console.log("hi");
      return next();
    } catch (e) {
      console.log(e);

      return res.redirect("/auth/login?redirect=" + originalUrl);
    }
  },
  isMentor: async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/auth/login");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      const savedUser = await user.findById(decoded.id);
      if (!savedUser) {
        return res.redirect("/auth/login");
      }
      if (!savedUser.isMentor) {
        return res.redirect("/dashboard");
      }
      req.user = savedUser;
      return next();
    } catch (e) {
      console.log(e);
      return res.redirect("/auth/login");
    }
  },
  forwardUser: async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      const savedUser = await user.findById(decoded.id);
      if (!savedUser) {
        return next();
      }
      req.user = savedUser;
      return res.redirect("/dashboard");
    } catch {
      return next();
    }
  },
};