import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import ProductInfo from './pages/ProductInfo/ProductInfo'
import Login from './pages/Login/Login'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<ProductInfo />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App