import { useEffect, useState } from 'react';
import './ManageOrders.css';
import { baseUrl } from '../../config';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    console.log('fetchOrders called');
    try {
      const res = await axios.get(`${baseUrl}/api/orders/admin/`);
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        console.warn('Error fetching orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${baseUrl}/api/orders/${orderId}/status`, {
        foodStatus: newStatus
      });
      console.log('Update response:', res.data);
      if (res.data.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, foodStatus: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const startIdx = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIdx, startIdx + ordersPerPage);

  return (
    <div className="admin-manage-orders">
      <h2>Manage Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : !orders.length ? (
        <p>No orders found.</p>
      ) : (
        <>
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Name</th>
                <th>Subtotal</th>
                <th>Address</th>
                <th>Payment Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map(order => (
                <tr key={order._id}>
                  <td data-label="Order ID">{order._id}</td>
                  <td data-label="Items">
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td data-label="Name">
                    {order.address?.firstName} {order.address?.lastName}
                  </td>
                  <td data-label="Subtotal">${order.totalPrice.toFixed(2)}</td>
                  <td data-label="Address">
                    {order.address?.st}, {order.address?.suburb}, {order.address?.city}, {order.address?.postal}, {order.address?.country}
                  </td>
                  <td data-label="Payment Status">
                    {order.paymentStatus ? "Paid" : "Cash on delivery"}
                  </td>
                  <td data-label="Status">
                    <select
                      value={order.foodStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Food Processing">Food Processing</option>
                      {order.paymentStatus === false && (
                        <option value="Ready for Pickup">Ready for Pickup</option>
                      )}
                      {order.paymentStatus && (
                        <>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageOrders;
