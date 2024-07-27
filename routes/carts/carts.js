const { Cart } = require("../../controller/carts/carts")
const cartItems = require("../../models/cart")


const express = require('express');
const routes = express.Router();

routes.post("/add-to-cart", Cart)  

  module.exports = routes;