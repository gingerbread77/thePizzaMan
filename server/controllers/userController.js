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

    if(exist) return res.status(400).json({success:false,msg:"Email is taken, please use another one"})

    // validate email format
    if(!validator.isEmail(email)) return res.status(400).json({success:false,msg:"Please enter a valid email"})

    if(password.length < 8) return res.status(400).json({success:false,msg:"The password must be at least 8 character."})

    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new userModel({
      email,
      password:hashedPassword
    })

    const user = await newUser.save()
    return res.json({success:true,user:{_id:user._id,email:user.email}})

  } catch (err){
    console.error(err);
    return res.status(500).json({success:false,msg:"Error"})
  }
}

const loginUser = async(req,res)=> {
  const { email,password } = req.body;

  try {
    const user = await userModel.findOne({email})
    
    if(!user) return res.status(400).json({success:false,msg:"Incorrect username or password"})

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch) return res.status(400).json({success:false,msg:"incorrect username or password"})

    const token = createToken(user._id)
    return res.status(200).json({success:true,token,user:{_id:user._id,email:user.email}})

  } catch(err){
    console.error(err)
    return res.status(500).json({success:false,msg:err})
  }
}

module.exports = { registerUser,loginUser }