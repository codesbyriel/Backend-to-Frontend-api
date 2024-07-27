const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("./models/product.js");
const Order = require("./models/orders.js");
const User = require("./models/users.js");
const cartItems = require("./models/cart.js");
const cors = require("cors");
const app = express();
const port = 5000;
const authRoutes = require("./routes/auth/index.js");
const cartsRoutes = require("./routes/carts/carts.js");

app.use(express.json({ extended: true }));

app.use(
  cors({
    //frontend url
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log('Backend connected')
});
//for Login and Register
app.use("/auth", authRoutes);
//for adding to cart
app.use("/carts", cartsRoutes);

///create product
app.post("/create-product", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(200).json("Product has been created");
});

//read
app.get("/find-products", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.get("/find-products/:id", async (req, res) => {
  //check to confirm its a valid mongoid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json("invalid id");
  }

  const products = await Product.findById(req.params.id);
  if (!products) {
    res.status(400).json("item not found");
  }
  //console.log(products)
  res.status(200).json(products);
});

//update
app.put("/update-products/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("invalid id");
    }

    if (!products) {
      res.status(400).json("product not found");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).json("product update not successful");
    }
    res
      .status(200)
      .json({ msg: "DATA UPDATED SUCCESSFULLY!", data: updatedProduct });
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete product
app.delete("/delete-products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json("Item deleted");
});

//orders
app.post("/orders", async (req, res) => {
  const allOrders = ({
    name,
    number,
    email,
    paymentMethod,
    address1,
    address2,
    city,
    state,
    country,
    postalCode,
  } = req.body);
  console.log(req.body);

  const newOrder = new Order(req.body);

  try {
    await newOrder.save();
    if (!allOrders) {
      return res.status(400).json({ message: "Input required field" });
    }
    return res.json("Orders succesfully made");
  } catch (error) {
    res
      .status(400)
      .json({ ERROR: "INPUT REQUIRED FIELD!", data: error.message });
  }
});

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
  console.log("Server running on port " + port);
});
