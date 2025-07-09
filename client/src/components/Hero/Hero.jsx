import { useNavigate } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const navigate = useNavigate();
  const navigateToMenu = () => {
    navigate('/menu');
  }
  return (
    <div className="hero-section">
      <div className="hero-header">
        <h2>Freshly Baked, Delivered Fast.</h2>
        <p>Your favorite pizza, just a click away.</p>
      </div>
      <button onClick={navigateToMenu}>Explore our Menu</button>
    </div>
  )
}

export default Hero