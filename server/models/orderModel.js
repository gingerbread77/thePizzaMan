const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true,
  },
  items: [
    {
      _id:String,
      name:String,
      price:Number,
      image:String,
      quantity:Number,
    }
  ],
  totalPrice:{
    type:Number,
    required:true,
  },
  address: {
    type:Object,
    required:true,
  },
  foodStatus:{
    type:String,
    default:"Food Processing",
  },
  paymentMethod:{
    type:String,
    default:"Cash on delivery",
  },
  paymentStatus:{
    type:Boolean,
    default:false,
  },
  date:{
    type:Date,
    default:Date.now(),
  },
})

module.exports = mongoose.model.Order || mongoose.model("Order",OrderSchema);