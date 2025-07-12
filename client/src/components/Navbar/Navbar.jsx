import { useState, useContext } from 'react'
import './Navbar.css'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"
import { FaUserCircle } from 'react-icons/fa'
import { AuthContext } from '../../context/AuthContext'

const Navbar = () => {
  const { role, token, logout } = useContext(AuthContext);
  const [showMenuDropDown, setShowMenuDropDown] = useState(false);
  const navigate = useNavigate();

  const toLoginPage = () => {
    navigate('/login');
  }

  const toggleMenuDropDown = () => {
    setShowMenuDropDown(!showMenuDropDown);
  }

  const Icon = showMenuDropDown ? FaTimes : FaBars;

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
      <ul className={`navlinks ${showMenuDropDown ? 'open' : ''}`}>
        <li><NavLink to="/" onClick={() => setShowMenuDropDown(false)}>Home</NavLink></li>
        {role === 'admin' ?
          <><li><NavLink to="/admin/products" onClick={() => setShowMenuDropDown(false)}>Manage Products</NavLink></li>
            <li><NavLink to="/admin/orders" onClick={() => setMenuOpen(false)}>Manage Orders</NavLink></li></> :
          <>
            <li><NavLink to="/menu" onClick={() => setShowMenuDropDown(false)}>Menu</NavLink></li>
            <li><NavLink to="/orders" onClick={() => setShowMenuDropDown(false)}>My Orders</NavLink></li>
          </>}
      </ul>
      <div className="navbar-right">
        <div className="cart">
          <Link to="/cart">
            <FaShoppingCart size={24} />
          </Link>
        </div>
        {token ? <div className="profile">
          <FaUserCircle size={24} />
          <ul className="profile-dropdown">
            <li className="logout" onClick={() => {
              logout();
              navigate('/');
            }}>Logout</li>
          </ul>
        </div> :
          <button onClick={toLoginPage}>Login</button>}
      </div>
    </nav>
  )
}

export default Navbar