import { useEffect, useState, useContext } from 'react';
import './UploadForm.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from '../../context/CartContext';

const UploadForm = ({ closeForm, editingProduct }) => {
  const { fetchFoodList } = useContext(CartContext);
  const isEdit = !!editingProduct;
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'pizza',
    description: '',
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: editingProduct.name || '',
        price: editingProduct.price || '',
        category: editingProduct.category || 'pizza',
        description: editingProduct.description || '',
        image: null,
        imagePreview: editingProduct.image ? `http://localhost:8000${editingProduct.image}` : null,
      });
    } else {
      setForm({
        name: '',
        price: '',
        category: 'pizza',
        description: '',
        image: null,
        imagePreview: null,
      });
    }
  }, [editingProduct, isEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: previewUrl,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClose = () => {
    closeForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && !form.image) {
      toast.error('Please upload an image before submitting');
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      if (key !== 'imagePreview' && form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
  let res;
  if (isEdit) {
    res = await axios.put(`http://localhost:8000/api/foods/${editingProduct._id}`, formData);
  } else {
    res = await axios.post('http://localhost:8000/api/foods/upload', formData);
  }

  if (res && (res.status === 200 || res.status === 201)) {
    toast.success(isEdit ? 'Product updated!' : 'Upload successful!');
    await fetchFoodList();
    handleClose();
  } else {
    toast.error('Something went wrong.');
  }
} catch (err) {
  console.error('Submit error:', err.response || err.message);
  toast.error('Failed to submit product');
}

  };

  return (
    <div className="admin-upload">
      <div className="upload-card">
        <button className="close-btn" onClick={handleClose}>x</button>
        <h2 className="upload-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Image</label>
            <input
              id="image-upload"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="preview"
                className="image-preview"
              />
            )}
            <label htmlFor="image-upload" className="upload-btn">
              {form.image ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              min="0"
              step="0.01"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="pizza">Pizza</option>
              <option value="chicken">Chicken</option>
              <option value="sides">Sides</option>
              <option value="drinks">Drinks</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            {isEdit ? 'Update Product' : 'Upload Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
