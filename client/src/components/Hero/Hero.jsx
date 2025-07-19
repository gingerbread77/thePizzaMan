import { useNavigate } from 'react-router-dom'
import './Hero.css'
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const Hero = () => {
  const { role } = useContext(AuthContext)
  const navigate = useNavigate();
  const navigateToMenu = () => {
    navigate('/menu');
  }
  return (
    <div className="hero-section">
      <div className="hero-header">
        {role === 'admin' ? <h2>Welcome back, admin!</h2> :
          <>
            <h2>Freshly Baked, Delivered Fast.</h2>
            <p>Your favorite pizza, just a click away.</p>
          </>}
      </div>
      {role === 'admin' ? "" :
        <button onClick={navigateToMenu}>Explore our Menu</button>
      }
    </div>
  )
}

export default Hero