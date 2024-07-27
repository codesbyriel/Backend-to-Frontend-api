const mongoose = require("mongoose");
const cartItems = require("../../models/cart")


const Cart = async (req, res) => {
    const {userId, productId} = req.body;
    
    try {
      let cart = await cartItems.findOne({ userId });
      if(!cart) {
        cart = new cartItems({ userId, items: [{productId, quantity: 1}] })
      }else {
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
        if (itemIndex > -1){
          cart.items[itemIndex].quantity += 1;
        }else {
          cart.items.push({productId, quantity: 1});
        }
      }
  
      await cart.save();
      res.status(200).json(cart);
    }catch(error){
      res.status(404).json({error: error.message})
    }
  };

  module.exports = {
    Cart
  }

  