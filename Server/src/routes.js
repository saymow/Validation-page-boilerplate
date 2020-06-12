const express = require("express");

const Routes = express.Router();

const auth = require("./middleware/auth");

const userController = require("./controller/userController");

Routes.post("/login", userController.login);
Routes.post("/register", userController.register);
Routes.post("/re-send-email", userController.reSendEmail);
Routes.get("/verify/:mailToken", userController.emailValidate);
Routes.post("/check_token", auth.Middleware, userController.tokenValidate);

Routes.get("/teste", auth.Middleware, (req, res) => res.json("success"));

module.exports = Routes;
