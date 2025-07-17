const express = require('express')
const { getMyOrders,placeOrder, updatePayment } = require('../controllers/orderController')

const orderRouter = express.Router()

orderRouter.get('/',getMyOrders)
orderRouter.post('/place-order',placeOrder)
orderRouter.put('/confirm/:id',updatePayment);

module.exports = orderRouter

