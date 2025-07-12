const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  cartData:{
    type:Object,
    default:{}
  }
},{minimize:false}) // keep empty cartData objects

module.exports = mongoose.models.User || mongoose.model("User",UserSchema)