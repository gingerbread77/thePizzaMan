import './Login.css'
import { useState, useContext } from 'react'
import axios from 'axios'
import { baseUrl } from '../../config'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate();
  const [page, setPage] = useState('login');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const clearFormData = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  const toggleStatus = () => {
    setPage((prev) => prev === 'login' ? 'register' : 'login');
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (page === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (page === 'register') {
        const res = await axios.post(`${baseUrl}/api/users/register`, { email, password });

        if (res.data.success) {
          setError('');
          setPage('login');
        } else {
          setError(res.data.msg);
          console.log(res.data.msg);
        }
      } else if (page === 'login') {
        const res = await axios.post(`${baseUrl}/api/users/login`, { email, password });
        if (res.data.success) {
          login({
            token: res.data.token,
            email: res.data.user.email,
            userId:res.data.user._id
          });
          setError('');
          clearFormData();
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{page === 'login' ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmitForm}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
          />
          {page === 'register' && <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            required
            onChange={handleChange}
          />}
          {error && <p className="error">{error}</p>}
          <button type="submit">{page === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="toggle-form">
          {page === 'login' ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => {
            toggleStatus();
            clearFormData();
          }}>
            {page === 'login' ? 'Sign up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login