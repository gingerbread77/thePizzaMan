import { useNavigate, useParams } from 'react-router-dom'
import './ProductInfo.css'
import { CartContext } from '../../context/CartContext'
import { AuthContext } from '../../context/AuthContext'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useContext,useState } from 'react';
import { baseUrl } from '../../config'

const ProductInfo = () => {
  const [qty,setQty] = useState(1);
  const navigate = useNavigate();
  const { addItemToCart, increaseItemQty, decreaseItemQty, cartItems,foodList } = useContext(CartContext);
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const product = foodList.find(item => String(item._id) === id);

  const handleAddToCart = (id) => {
    if (!token) {
      toast.error("Plase login in to add items to cart");
      navigate('/login');
      return;
    }
    addItemToCart(id,qty);
    toast.success("Added to cart");
    navigate('/menu');
  }

  const updateItemQty = (id, action) => {
    if (action === "Add") {
      setQty(qty + 1);
    } else if (action === 'Remove') {
      setQty(qty - 1);
    }
  }

  if (!product) {
    return <div className="product-info">Loading...</div>
  }
  return (
    <div className="product-info">
      <div className="product-container">
        <img className="product-img" src={`${baseUrl}${product.image}`} alt={product.name} />
        <div className="info-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>{product.price.toFixed(2)}</h3>
          <div className="info-actions">
            <button
              onClick={() => updateItemQty(id, "Remove")}
              disabled={(qty <= 1)}
            >
              <FaMinus />
              </button>
            <span>{qty}</span>
            <button
              onClick={() => updateItemQty(id, "Add")}
            ><FaPlus />
            </button>
          </div>
          <button className="add-cart-btn" onClick={() => handleAddToCart(id)}>Add to Cart</button>
        </div>
      </div>
    </div>

  )
}

export default ProductInfo