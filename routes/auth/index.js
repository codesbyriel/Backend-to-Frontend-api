const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/users");
const { Reg, Log } = require("../../controller/auth/index.js");

//an instance of a router
const routes = express.Router();

/* POST /Login
 *  Route to handle user login
 *  excepts request body to contain Username and Password
 *   validates input and confirm registration information from mongodb*/
routes.post("/login", Log)
routes.post("/register", Reg);

module.exports = routes;
