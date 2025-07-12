const userModel = require('../models/userModel')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (id) => {
  return jwt.sign({id},process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const exist = await userModel.findOne({email})

    if(exist){
      return res.json({success:false,msg:"Email is taken, please use another one"})
    }

    // validate email format
    if(!validator.isEmail(email)){
      return res.json({success:false,msg:"Please enter a valid email"})
    }

    if(password.length < 8){
      return res.json({success:false,msg:"The password must be at least 8 character."})
    }

    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new userModel({
      email,
      password:hashedPassword
    })

    const user = await newUser.save()
    res.json({success:true,user:{_id:user._id,email:user.email}})

  } catch (err){
    console.error(err);
    return res.json({success:false,msg:"Error"})
  }
}

const loginUser = async(req,res)=> {
  const { email,password } = req.body;

  try {
    const user = await userModel.findOne({email})
    
    if(!user){
      return res.json({success:false,msg:"Incorrect username or password"})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.json({success:false,msg:"incorrect username or password"})
    }

    const token = createToken(user._id)
    return res.json({success:true,token,user:{_id:user._id,email:user.email}})

  } catch(err){
    console.error(err)
    res.json({success:false,msg:err})
  }
}

module.exports = { registerUser,loginUser }