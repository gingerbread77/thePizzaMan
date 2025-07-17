import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { baseUrl } from '../../config';
import axios from 'axios';

const OrderSuccess = () => {
  const { clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user._id || !token) {
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await axios.put(
          `${baseUrl}/api/orders/confirm/${id}`, 
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          console.log('Payment confirmed');
          await clearCart();
          setLoading(false);
          setTimeout(() => navigate('/my-orders'), 3000);
        } else {
          setError('Payment confirmation failed.');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred during payment confirmation.');
        setLoading(false);
      }
    };

    confirmPayment();
  }, [user,id]);

  if (loading) {
    return (
      <div className="success-page">
        <h2>Processing your order...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <h2>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="success-page">
      <h2>Payment Successful!</h2>
      <p>Redirecting to your orders...</p>
    </div>
  );
};

export default OrderSuccess;
