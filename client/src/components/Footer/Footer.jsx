import './Footer.css'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="brand footer-col">
          <h2 className="logo">ThePizzaMan</h2>
          <div className="social-media">
            <FaFacebookF size={20}></FaFacebookF>
            <FaInstagram size={20} />
            <FaTiktok size={20} />
          </div>
        </div>
        <div className="footer-col">
          <h4>About Us</h4>
          <ul>
            <li>Our Story</li>
            <li><Link to="/menu">Menu</Link></li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>123 Pizza Street</li>
            <li>Auckland,NZ</li>
            <li>(09)123-4567</li>
            <li>thePizzaMan@pizza.com</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Hours</h4>
          <ul>
            <li>Mon-Fri:10am-9pm</li>
            <li>Sat-Sun:12pm-10pm</li>
            <li>Holidays:Closed</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer