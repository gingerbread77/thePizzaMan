const express = require('express')
const multer = require('multer')
const foodRouter = express.Router()
const { getAllFood } = require('../controllers/foodController')

foodRouter.get('/',getAllFood)
module.exports = foodRouter