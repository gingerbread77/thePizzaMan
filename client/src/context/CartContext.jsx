import { useState, useContext, useEffect, createContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { baseUrl } from '../config';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const { token, user,role } = useContext(AuthContext);

  const subtotal = Object.entries(cartItems).reduce((total, [id, qty]) => {
    const item = foodList.find(f => f._id === id);
    if (!item) return total;
    return total + item.price * qty;
  }, 0);

  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/foods`);
      setFoodList(res.data);
    } catch (err) {
      console.error("Failed to fetch food list", err);
    }
  };

  const fetchCart = async () => {
    if (!token || !user?._id) {
      console.log('No token or userId');
      return;
    }

    try {
      const res = await axios.get(`${baseUrl}/api/cart?userId=${user._id}`);
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      } else {
        console.log('Failed to fetch cart', res.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const increaseItemQty = (itemId, quantity = 1) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + quantity
    }));
  };

  const decreaseItemQty = async (itemId, quantity = 1) => {
    // decrease for UI
    setCartItems(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = currentQty - quantity;

      if (newQty > 0) {
        return { ...prev, [itemId]: newQty };
      } else {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
    });

    // decrease item inside the database
    try {
      const res = await axios.post(`${baseUrl}/api/cart/remove`, {
        userId: user._id,
        itemId: itemId
      });

      if (!res.data.success) {
        console.log('Failed to remove item', res.data.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const addItemToCart = async (itemId, quantity = 1) => {
    if (!token) return;

    try {
      const res = await axios.post(`${baseUrl}/api/cart/add`, {
        userId: user._id,
        itemId: itemId,
        quantity
      });

      if (res.data.success) {
        setCartItems(res.data.cartData);
        console.log(res.data.cartData);
      } else {
        console.log('Failed to add item', res.data.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

const clearCart = async () => {
  try {
    const res = await axios.post(`${baseUrl}/api/cart/clear`, { userId: user._id });
    if (res.data.success) { 
      setCartItems(res.data.cartData || {});
    } else {
      console.warn('Failed to clear cart on server');
    }
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    if (token && user?._id && role === 'user') {
      fetchCart();
    } else {
      setCartItems({});
    }
  }, [token, user?._id,role]);

  useEffect(() => {
    fetchFoodList();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      foodList,
      fetchFoodList,
      fetchCart,
      addItemToCart,
      increaseItemQty,
      decreaseItemQty,
      setCartItems,
      subtotal,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
