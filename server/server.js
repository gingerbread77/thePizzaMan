require('dotenv').config()
const express = require('express')
const connectDB = require('./database/db')
const cors = require('cors')
const path = require('path')
const foodRoutes = require('./routes/foodRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express()

const PORT = process.env.PORT || 8000

// connect to database
connectDB();

// enable cross-origin resource sharing from renders
app.use(cors())
// app.use(cors({
//   origin: "https://thepizzaman-frontend.onrender.com",
//   allowedHeaders: ["Content-Type"],
//   credentials: true,
// }));

// Parse JSON request bodies into req.body
app.use(express.json())
// Serve 'uploads' folder as static files for client access
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

// api endpoints
app.use('/api/foods',foodRoutes)
app.use('/api/users',userRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/orders',orderRoutes)

app.get('/',(req,res)=>{
  res.send('test');
})


app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})