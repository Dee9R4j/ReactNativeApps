import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useShop } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './OrderForm.css';

const OrderForm = ({ onClose, cartItems }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { dispatch } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          date: new Date().toISOString()
        }),
      });


      dispatch({
        type: 'ADD_ORDER',
        payload: {
          ...formData,
          items: cartItems,
          date: new Date().toISOString(),
          id: Date.now()
        }
      });
      dispatch({ type: 'CLEAR_CART' });
      
      setShowSuccess(true);
    } catch (error) {
      alert('Error placing order. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    navigate('/orders');
  };

  return (
    <div className="order-form-overlay">
      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <CheckCircle size={48} color="#4CAF50" className="success-icon" />
            <h3>Order Placed Successfully!</h3>
            <p>Your items will be shipped within 3-5 business days</p>
            <button 
              className="success-ok-button"
              onClick={handleSuccessClose}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="order-form-content">
        <div className="form-header">
          <ArrowLeft className="close-icon" onClick={onClose} size={35} />
          <h2>Checkout Details</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              required
              placeholder="Enter complete shipping address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows="4"
            />
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.photo1} alt={item.name} className="item-image" />
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-order-btn">
            Confirm & Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
