const express = require('express')
const multer = require('multer')
const { getAllFood } = require('../controllers/foodController')

const foodRouter = express.Router()

foodRouter.get('/',getAllFood)

module.exports = foodRouter