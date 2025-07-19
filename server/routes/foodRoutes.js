const express = require('express')
const multer = require('multer')
const { getAllFood,createFood,editFood,deleteFood} = require('../controllers/foodController')

const foodRouter = express.Router()
const storage = multer.memoryStorage()

const upload = multer({storage})

foodRouter.get('/',getAllFood)
foodRouter.post('/upload',upload.single('image'),createFood)
foodRouter.put('/:id',upload.single('image'),editFood)
foodRouter.delete('/:id',deleteFood)

module.exports = foodRouter