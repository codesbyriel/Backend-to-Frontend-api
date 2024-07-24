const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    number:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    paymentMethod:{
        type: String,
        required: true,
    },
    address1:{
        type: String,
        required: true,
    },
    address2:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    postalCode:{
        type: String,
        required: true,
    }
});

const Order = mongoose.model("orders", ordersSchema)

module.exports = Order