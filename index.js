const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const app = express();
const port = 3000;

app.use(express.json());

async function hashPass(password) {
  const res = await bcrypt.hash(password, 10);
  //console.log(res);
  return res;
}

async function compare(userPass, hashPass){
  const res = await bcrypt.compare(userPass,hashPass)
  return res
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* POST /Login
*  Route to handle user login
*  excepts request body to contain Username and Password
*   validates input and saves login information to mongodb*/
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
   
 
  //check if both username and password are provied
  if (!email || !password) {
    return res.status(400).json("Input the required data");
  }

  try {
   const user = await UserModel.findOne({ email });
   if(!user) {
    return res.status(400).json('Invalid email or password')
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if(!isPasswordValid){
    return res.json("Invalid Password")
   }

    
    return res.json("Logged in succesfully");
  } catch (error) {
    console.log("Error during login");
  }
});


app.post("/Register", async (req, res) => {
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

    if (existingUser) {
       id = existingUser._id.toString()
      return res.status(400).json("Email is already registered");
    }
    const Token = jwt.sign({ _id:id }, "helloiamgabrielandomoidontireomyheaddeypainmeganbutwepushhardernopainnogain")

    console.log(Token)
    await UserModel.updateOne({ _id:id },{$set:{token:Token}})

    const hashedPassword = await hashPass(password);

    const user_created = await UserModel.create({
      username: username_body,
      email: email_body,
      password: hashedPassword,
      token: Token
    });
    
    
    
    
    console.log(user_created);
    
    const data = {
      password: hashedPassword,
      token: Token
    };

    return res.json("Resgistration successful");
  } catch (error) {
    console.log("Error during registration", error);
    return res.status(500).json("An error occured during registration");
  }
});


//Schema for storing Register information
const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String
});


const UserModel = mongoose.model("RegisteredUsers", UserSchema);

//Connect to Mongodb with the specified connection string
const CONNECTION_URL =
  "mongodb+srv://blogs:mongodb@gabriel.3z0wwkz.mongodb.net/?retryWrites=true&w=majority&appName=GABRIELL";

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  })
  .catch((error) => {
    console.log("Error connecting to mongodb");
  });

app.listen(port, () => {
  console.log("Server running on port 3000");
});
