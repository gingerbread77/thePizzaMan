import './Checkout.css';
import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { baseUrl } from '../../config';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const { subtotal, fetchCart, cartItems, clearCart, foodList } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    st: '',
    suburb: '',
    city: '',
    postal: '',
    country: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast.warn('Please select a payment method');
      return;
    }

    const deliveryFee = paymentMethod === 'cash' ? 0 : 10;

    const itemsWithDetails = Object.entries(cartItems).map(([itemId, quantity]) => {
      const food = foodList.find(f => f._id === itemId);
      return {
        _id: itemId,
        name: food?.name || '',
        price: food?.price || 0,
        image: food?.image || '',
        quantity
      };
    });

    try {
      const res = await axios.post(`${baseUrl}/api/orders/place-order`, {
        userId,
        items: itemsWithDetails,
        totalPrice: subtotal + deliveryFee,
        address: formData,
        paymentMethod,
      });

      const data = res.data;
      console.log('Order response:', data);

      if (!data.success) {
        toast.error('Order creation failed.');
        return;
      }

      if (paymentMethod === 'card') {
        if (data.session_url) {
          window.location.href = data.session_url;
        } else {
          toast.error('Stripe session not created');
        }
      } else if (paymentMethod === 'cash') {
        toast.success('Order placed successfully.');
        await clearCart();
        fetchCart();
        navigate('/my-orders');
      }

    } catch (error) {
      console.error('Place order error:', error);
      toast.error('Something went wrong while placing order.');
    }
  };

  return (
    <div className="shipping-container">
      <div className="form-header">
        <h3 className="section-header">Shipping Information</h3>
      </div>
      <form className="shipping-form" onSubmit={handlePlaceOrder}>
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="st"
            placeholder="Street"
            value={formData.st}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="suburb"
            placeholder="Suburb"
            value={formData.suburb}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="postal"
            placeholder="Postal Code"
            value={formData.postal}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </div>

        <h3 className="section-header">Payment</h3>
        <div className="form-row">
          <select name="payment-method" value={paymentMethod} onChange={handlePaymentChange} required>
            <option value="">Select Payment Method</option>
            <option value="card">Credit/Debit Card</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>

        <h3 className="section-header">Cart Totals</h3>
        <div className="cart-totals-card">
          <div className="cart-row">
            <span>Total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {paymentMethod === 'card' && (
            <>
              <div className="cart-row">
                <span>Delivery Fee:</span>
                <span>$10.00</span>
              </div>
              <div className="cart-row total-highlight">
                <span>SubTotal:</span>
                <span>${(subtotal + 10).toFixed(2)}</span>
              </div>
            </>
          )}

          {paymentMethod === 'cash' && (
            <div className="cart-row total-highlight">
              <span>SubTotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          )}
        </div>

        <button type="submit" className="submit">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
