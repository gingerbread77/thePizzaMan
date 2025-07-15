const express = require('express')
const cartRouter = express.Router()

const { addToCart,removeFromCart,clearCart,getCart } = require('../controllers/cartController')

cartRouter.post('/add',addToCart)
cartRouter.post('/remove',removeFromCart)
cartRouter.post('/clear',clearCart)
cartRouter.get('/',getCart)

module.exports = cartRouter;