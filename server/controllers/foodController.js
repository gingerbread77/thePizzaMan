const foodModel = require('../models/foodModel')

const getAllFood = async (req,res) => {
  try {
    const foods = await foodModel.find()
    res.status(200).json(foods)
  } catch (err){
    console.error(err);
    res.status(500).json({success:false, msg:"Failed to fetch food data", error:err})
  }
}

module.exports = { getAllFood }