const FoodModel = require('../models/FoodModel')
const fs = require('fs')
const path = require('path')

const createFood = async (req,res) => {
  try {
    const { name, price, category, description } = req.body

    if(!req.file){
      return res.status(404).json({success:false,msg:"Image is required"})
    }

    // create model before upload image
    const food = new FoodModel({
      name,
      price,
      category,
      description,
      image:'temp',
    })

    // save into database
    const savedFood = await food.save();

    const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g,'-')}`
    const filepath = path.join(__dirname,'../uploads',filename)
    fs.writeFileSync(filepath,req.file.buffer)

    savedFood.image = `/uploads/${filename}`
    await savedFood.save()
    res.status(200).json({success:true,msg:"Upload successful"})
  } catch (err){
    console.error(err)
    res.status(500).json({success:false,msg:"Upload failed",error:err.msg})
  }
}

const editFood = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const foodId = req.params.id;

    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    if (name) food.name = name;
    if (price) food.price = price;
    if (category) food.category = category;
    if (description) food.description = description;

    // delete the old image
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', food.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // upload the new one
      const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      const filepath = path.join(__dirname, '../uploads', filename);
      fs.writeFileSync(filepath, req.file.buffer);
      food.image = `/uploads/${filename}`;
    }

    await food.save();
    res.status(200).json({ success: true, msg: "Product updated", food });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Edit failed", error: err.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const imagePath = path.join(__dirname, '..','uploads', path.basename(food.image));

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await foodModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success:true,msg: "Product deleted successfully" });
  } catch (err) {
    console.error('Error', err);
    res.status(500).json({ success:false,msg: 'Error' });
  }
}

const getAllFood = async (req,res) => {
  try {
    const foods = await foodModel.find()
    return res.status(200).json(foods)
  } catch (err){
    console.error(err);
    return res.status(500).json({success:false, msg:"Failed to fetch food data", error:err})
  }
}

module.exports = { createFood,getAllFood,editFood,deleteFood }