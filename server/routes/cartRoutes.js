const express = require('express')
const { addToCart,removeFromCart,clearCart,getCart } = require('../controllers/cartController')

const cartRouter = express.Router()

cartRouter.post('/add',addToCart)
cartRouter.post('/remove',removeFromCart)
cartRouter.post('/clear',clearCart)
cartRouter.get('/',getCart)

module.exports = cartRouter;