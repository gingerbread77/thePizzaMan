const express = require('express')
const { getMyOrders,placeOrder, updatePayment,getAllOrders,updateOrderStatus } = require('../controllers/orderController')

const orderRouter = express.Router()

orderRouter.get('/',getMyOrders)
orderRouter.post('/place-order',placeOrder)
orderRouter.put('/confirm/:id',updatePayment)
orderRouter.get('/admin',getAllOrders)
orderRouter.put('/:id/status',updateOrderStatus)

module.exports = orderRouter

