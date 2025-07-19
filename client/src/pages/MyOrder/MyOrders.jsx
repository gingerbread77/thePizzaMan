import { useEffect, useState, useContext } from 'react';
import './MyOrders.css';
import { AuthContext } from '../../context/AuthContext';
import { baseUrl } from '../../config';
import axios from 'axios';

const MyOrders = () => {
  const { user, token } = useContext(AuthContext);
  const userId = user?._id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const getMyOrders = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/orders/`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        console.warn('Failed to fetch orders', res.data.msg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token && userId) { 
      getMyOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [token, userId]);

  if (!token) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <p>Please login to view your orders.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIdx = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIdx, startIdx + ordersPerPage);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {loading ? (
        <p>Loading your orders...</p>
      ) : !orders.length ? (
        <p>No orders found.</p>
      ) : (
        <>
          {currentOrders.map(order => (
            <div key={order._id} className="my-order">
              <h3>Order ID: {order._id}</h3>
              <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.foodStatus}</p>
              <table className="my-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item._id}>
                      <td>
                        <img src={`${baseUrl}${item.image}`} alt={item.name} />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity || 1}</td>
                      <td>${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  ))}
                  {order.paymentMethod === 'card' && (
                    <tr>
                      <td colSpan={3} className="my-deliver-label">Delivery Fee:</td>
                      <td className="my-deliver-fee">$10.00</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}

          <div className="my-pagination">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
