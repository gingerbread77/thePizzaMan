import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import ProductInfo from './pages/ProductInfo/ProductInfo'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<ProductInfo />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App