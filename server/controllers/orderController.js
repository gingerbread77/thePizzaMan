const orderModel = require('../models/orderModel')
const userModel = require('../models/UserModel')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const frontendUrl = 'https://thepizzaman-frontend.onrender.com'

const getMyOrders = async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ success: false, msg: "User does not exist" })
  }
  try {
    const orders = await orderModel.find({ userId }).sort({ date: -1 })
    return res.status(200).json({ success: true, orders })

  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, msg: "Error fetching order data" })
  }
}

const placeOrder = async (req, res) => {
  const { userId, items, totalPrice, address, paymentMethod } = req.body;
  try {
    await orderModel.deleteMany({ userId, paymentStatus: false })
    const newOrder = new orderModel({
      userId,
      items,
      totalPrice,
      address,
      paymentMethod,
    })

    if (paymentMethod === 'cash') {
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} })
      return res.status(200).json({ success: true, msg: "Ordered placed" })
    }

    const line_items = [
      {
        price_data: {
          currency: 'nzd',
          product_data: { name: 'Order Total' },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      }
    ]
    await newOrder.save();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${frontendUrl}/orders/success/${newOrder._id}`,
      cancel_url: `${frontendUrl}/cart`,
    })

    return res.status(200).json({ success: true, session_url: session.url })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, msg: err })
  }
}

const updatePayment = async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(req.params.id, { paymentStatus: true }, { new: true })

    if (!updatedOrder) {
      return res.status(404).json({ success: false, msg: "Order not found" })
    }
    res.status(200).json({success:true,order:updatedOrder})
  } catch(err){
    console.error(err)
    res.status(500).json({success:false,msg:"Failed to udpate order status"})
  }
}

// admin manage orders
const getAllOrders = async (req,res) => {
  try {
    const orders = await orderModel.find()
    res.json({success:true,orders})
  } catch (err){
    console.error(err)
    return res.status(500).json({success:false,msg:"Failed to get orders"})
  }
}

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { foodStatus } = req.body; 

  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { foodStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }
    return res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = { getMyOrders, placeOrder,updatePayment,getAllOrders,updateOrderStatus }