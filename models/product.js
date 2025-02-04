const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      category: {
        type: String,
        required: true,
        trim: true
      },
      brand: {
        type: String,
        required: true,
        trim: true
      },
      imageUrl: {
        type: String,
        trim: true
      },
      ratings: {
        type: Number,
        default: 0
      },
      
      createdAt: {
        type: Date,
        default: Date.now
      }    
});

const Product = mongoose.model("products", productSchema)

module.exports = Product