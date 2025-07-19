import { useContext, useState } from 'react';
import UploadForm from '../../components/Admin/UploadForm';
import { CartContext } from '../../context/CartContext';
import './ManageProducts.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../../config';
import { FaPlus } from 'react-icons/fa';

const ManageProduct = () => {
  const {foodList,fetchFoodList} = useContext(CartContext);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchFoodList();
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/api/foods/${id}`);
      if (res.data.success) {
        toast.success('Product deleted successfully!');
        fetchFoodList();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="manage-product">
      <h2>Manage Products</h2>
      <div className="product-list">
        {foodList.map(food => (
          <div key={food._id} className="product-card">
            <div className="category-badge">{food.category}</div>
            <img src={`${baseUrl}${food.image}`} alt={food.name} className="product-image" />
            <h3>{food.name}</h3>
            <p>${food.price}</p>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => { setEditingProduct(food); setShowForm(true); }}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(food._id)}>Delete</button>
            </div>
          </div>
        ))}

        <div className="product-card add-new-card" onClick={() => { setShowForm(true); setEditingProduct(null); }}>
          <div className="add-icon"><FaPlus /></div>
          <p className="add-text">Add New Product</p>
        </div>
      </div>

      {showForm && (
        <>
          <div className="overlay" onClick={closeForm}></div>
          <div className="upload-form-container">
            <UploadForm closeForm={closeForm} editingProduct={editingProduct} />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProduct;
