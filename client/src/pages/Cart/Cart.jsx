import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { baseUrl } from '../../config';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from "react-toastify";

import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    increaseItemQty,
    decreaseItemQty,
    clearCart,
    addItemToCart,
    removeFromCart,
    foodList,
  } = useContext(CartContext);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const isEmptyCart = Object.keys(cartItems).length === 0;

  const subtotal = Object.entries(cartItems).reduce((total, [id, qty]) => {
    const item = foodList.find(f => f._id === id);
    if (!item) return total;
    return total + item.price * qty;
  }, 0);

  const handleDecrease = (id) => {
    if (cartItems[id] === 1) {
      setConfirmDeleteId(id);
    } else {
      decreaseItemQty(id);
    }
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      decreaseItemQty(confirmDeleteId);
      setConfirmDeleteId(null);
      toast.success('Item removed!');
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {isEmptyCart ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          <div className="cart-header">
            <h4>PRODUCT</h4>
            <h4>QTY</h4>
            <h4>Unit Price</h4>
            <h4>Total</h4>
          </div>
          <div className="cart-items">
            {Object.entries(cartItems).map(([id, quantity]) => {
              const item = foodList.find(f => f._id === id);
              if (!item) return null;

              return (
                <div className="cart-item" key={id}>
                  <div className="cart-product">
                    <img className="item-img" src={`${baseUrl}${item.image}`} alt={item.name} />
                    <p>{item.name}</p>
                  </div>
                  <div className="quantity-control">
                    <button className="minus-btn" onClick={() => {
                      handleDecrease(id);
                      removeFromCart(id);
                    }}>
                      <FaMinus />
                    </button>
                    <span>{quantity}</span>
                    <button className="plus-btn" onClick={() => {
                      increaseItemQty(id);
                      addItemToCart(id)
                      }}>
                      <FaPlus />
                    </button>
                  </div>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  <p>${(item.price * quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          <button onClick={clearCart} className="clear-btn">Clear Cart</button>

          <div className="cart-subtotal">
            <h3>Subtotal:</h3>
            <p>${subtotal.toFixed(2)}</p>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Remove this item from your cart?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="modal-confirm">Yes</button>
              <button onClick={() => setConfirmDeleteId(null)} className="modal-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
