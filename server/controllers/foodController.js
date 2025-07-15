const foodModel = require('../models/FoodModel')

const getAllFood = async (req,res) => {
  try {
    const foods = await foodModel.find()
    return res.status(200).json(foods)
  } catch (err){
    console.error(err);
    return res.status(500).json({success:false, msg:"Failed to fetch food data", error:err})
  }
}

module.exports = { getAllFood }