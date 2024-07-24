const mongoose = require("mongoose");
const UserModel = require("../../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "helloiamgabrielandomoidontireomyheaddeypainmeganbutwepushhardernopainnogain";

async function hashPass(password) {
  const res = await bcrypt.hash(password, 10);
  //console.log(res);
  return res;
}

async function compare(userPass, hashPass) {
  const res = await bcrypt.compare(userPass, hashPass);
  return res;
}

const Log = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  //check if both username and password are provied
  if (!email || !password) {
    return res.status(400).json("Input the required data");
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid email");
    }
 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json("Invalid Password");
    }

    //create a token - use the user id and email from the data you grabbed from the database
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET, // Ensure you have a JWT secret in your environment variables
      { expiresIn: "1h" } // Token expiration time
    );
    console.log(token)
    
    return res.status(200).json({ msg: "Logged in succesfully", access_token: token });
  } catch (error) {
    console.log("Error during login");
  }
};
 
const Reg = async (req, res) => {
  const { username, password, email } = req.body;

  console.log(req.body);

  const username_body = req.body.username;
  const email_body = req.body.email;
  const password_body = req.body.password;

  if (!username || !password || !email) {
    return res.status(400).json("Input required field");
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    let id;
    console.log(existingUser)
    
    if (existingUser) {
      id = existingUser._id.toString();
      return res.status(400).json({ msg:"Email is already registered" });
    };
    const Token = jwt.sign(
      { _id: id },
      "helloiamgabrielandomoidontireomyheaddeypainmeganbutwepushhardernopainnogain"
    );


    //console.log(Token);
    await UserModel.updateOne({ _id: id }, { $set: { token: Token } });

    const hashedPassword = await hashPass(password);

    const user_created = await UserModel.create({
      username: username_body,
      email: email_body,
      password: hashedPassword,
      token: Token,
    });

    console.log(user_created);

    const data = {
      password: hashedPassword,
      token: Token,
    };

    return res.json("Resgistration successful");
  } catch (error) {
    console.log("Error during registration", error);
    return res.status(500).json("An error occured during registration");
  }
};

module.exports = {
  Reg,
  Log,
};
