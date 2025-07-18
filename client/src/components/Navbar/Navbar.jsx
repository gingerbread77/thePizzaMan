import { useState, useContext,useRef,useEffect } from 'react'
import './Navbar.css'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"
import { FaUserCircle } from 'react-icons/fa'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'

const Navbar = () => {
  const { role, token, logout } = useContext(AuthContext);
  const [showMenuDropDown, setShowMenuDropDown] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const totalItemsInCart = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const toLoginPage = () => {
    navigate('/login');
  }

  const toggleMenuDropDown = () => {
    setShowMenuDropDown(!showMenuDropDown);
  }

  const Icon = showMenuDropDown ? FaTimes : FaBars;
  const [hidden,setHidden] = useState(false);
  const lastScrollY = useRef(0);

useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // hiden navbar when scroll down more than 100px 
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar-wrapper ${hidden ? 'hidden' : ''}`}>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle">
            <Icon size={24} className="dropdown-icon" onClick={toggleMenuDropDown}></Icon>
          </button>
          <Link className="header" to="/">
            <img className="logo" src="/logo.png" alt="logo" />
            <h2>ThePizzaMan</h2>
          </Link>
        </div>
        <ul className={`navlinks ${showMenuDropDown ? 'open' : ''}`}>
          <li><NavLink to="/" onClick={() => setShowMenuDropDown(false)}>Home</NavLink></li>
          {role === 'admin' ?
            <><li><NavLink to="/admin/products" onClick={() => setShowMenuDropDown(false)}>Products</NavLink></li>
              <li><NavLink to="/admin/orders" onClick={() => setMenuOpen(false)}>Orders</NavLink></li></> :
            <>
              <li><NavLink to="/menu" onClick={() => setShowMenuDropDown(false)}>Menu</NavLink></li>
              <li><NavLink to="/my-orders" onClick={() => setShowMenuDropDown(false)}>My Orders</NavLink></li>
            </>}
        </ul>
        <div className="navbar-right">
          <div className="cart">
            {role === 'admin' ? "" :
              <Link to="/cart">
                <FaShoppingCart className="icon" size={24} />
                {totalItemsInCart > 0 && (
                  <div className="cart-quantity-container">{totalItemsInCart}</div>
                )}
              </Link>}
          </div>
          {token ? <div className="profile">
            <FaUserCircle size={24} className="icon" />
            <ul className="profile-dropdown">
              {role === 'user' && (
                <li onClick={() => navigate('/my-orders')}>My Orders</li>
              )}
              <li className="logout" onClick={() => {
                logout();
                navigate('/');
              }}>Logout</li>
            </ul>
          </div> :
            <button onClick={toLoginPage}>Login</button>}
        </div>
      </nav>
    </div>
  )
}

export default Navbar