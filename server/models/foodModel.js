const mongoose = require('mongoose')

const FoodSchema = new mongoose.Schema({
  image: {
    type:String,
  },
  name:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  }
})

// register only one time
module.exports = mongoose.models.Food || mongoose.model("Food",FoodSchema)