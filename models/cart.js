const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId:{
        type: String,
        required: true
    },
    quantity:{
        type:Number,
        required:true,
        default: 1
    }
});

const CartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },
    items:[CartItemSchema]
})

const cartItems = mongoose.model("carts", CartSchema)

module.exports = cartItems