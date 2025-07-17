const userModel = require('../models/UserModel')

const addToCart = async (req, res) => {
  const { userId, itemId,quantity = 1 } = req.body

  if (!userId || !itemId) return res.status(200).json({ success: false, msg: "Missing userId or itemId" })

  try {
    const user = await userModel.findById(userId)

    if (!user) return res.status(400).json({ success: false, msg: "User not found" })

    const cartData = user.cartData || {}
    cartData[itemId] = (cartData[itemId] || 0) + 1
    await userModel.findByIdAndUpdate(userId, { cartData })
    return res.status(200).json({ success: true,cartData, msg: "Added to cart" })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, msg: "Error" })
  }
}

const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body
  try {
    const user = await userModel.findById(userId)
    const cartData = user.cartData || {}

    if (!cartData[itemId]) return res.status(400).json({ success: false, msg: "Item does not exist" })

    // decrease item quantity by 1
    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1
      // remove item
    } else {
      delete cartData[itemId]
    }

    await userModel.findByIdAndUpdate(userId, { cartData })
    res.status(200).json({ success: true, msg: "Removed from cart" })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, msg: "Error" })
  }
}

const clearCart = async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json({ success: false, msg: "User does not exist" })
  try {
    await userModel.findByIdAndUpdate(userId, { cartData: {} })
    return res.status(200).json({success:true,cartData:{}})
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, msg: "Error" })
  }
}

const getCart = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ success: false, msg: "User does not exist" })
  try {
    const user = await userModel.findById(userId)
    const cartData = user.cartData || {}
    return res.status(200).json({success:true,cartData})
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, msg: "Error" })
  }
}

module.exports = { addToCart, removeFromCart, clearCart,getCart }