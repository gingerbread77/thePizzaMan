import { useState } from 'react'
import './Navbar.css'
import { NavLink, Link } from 'react-router-dom'
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"

const Navbar = () => {
  const [showMenuDropDown,setShowMenuDropDown] = useState(false);

  const toggleMenuDropDown = () => {
    setShowMenuDropDown(!showMenuDropDown);
  }

  const Icon = showMenuDropDown ? FaTimes:FaBars;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle">
          <Icon size={24} onClick={toggleMenuDropDown}></Icon>
        </button>
        <Link className="header" to="/">
          <img className="logo" src="./logo.png" alt="logo" />
          <h2>ThePizzaMan</h2>
        </Link>
      </div>
      <ul className={`navlinks ${showMenuDropDown? 'open':''}`}>
        <li><NavLink to="/" onClick={()=>setShowMenuDropDown(false)}>Home</NavLink></li>
        <li><NavLink to="/menu" onClick={()=>setShowMenuDropDown(false)}>Menu</NavLink></li>
        <li><NavLink to="/ordres" onClick={()=>setShowMenuDropDown(false)}>My Orders</NavLink></li>
      </ul>
      <div className="navbar-right">
        <div className="cart">
          <Link to="/cart">
            <FaShoppingCart size={24}/>
          </Link>
        </div>
        <button>Login</button>
      </div>
    </nav>
  )
}

export default Navbar