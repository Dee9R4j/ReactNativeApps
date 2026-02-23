import { useNavigate } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import { useShop } from '../Context/ShopContext';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useShop();

  const handleDeleteOrder = (orderId) => {
    dispatch({
      type: "REMOVE_ORDER",
      payload: orderId
    });
  };

  return (
    <div className="orders-container">
      <button className="close-button" onClick={() => navigate('/')}>
        <X size={24} />
      </button>
      <h2>Order History</h2>

      {state.orders.length === 0 ? (
        <p className="empty-message">No orders found.</p>
      ) : (
        state.orders.map((order, index) => (
          <div key={order.id || index} className="order-item">
            <div className="order-header">
              <div className="order-header-left">
                <h3>Order #{index + 1}</h3>
                <p className="order-date">
                  {new Date(order.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <button 
                className="delete-order-button"
                onClick={() => handleDeleteOrder(order.id)}
                aria-label="Delete order"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="order-details">
              <div className="customer-info">
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Address:</strong> {order.address}</p>
              </div>

              <h4 className="items-heading">Items Purchased:</h4>
              {order.items.map((item, i) => (
                <div key={i} className="order-product">
                  <img src={item.photo1} alt={item.name} className="order-image" />
                  <div className="product-info">
                    <p className="product-name">{item.name}</p>
                    <div className="product-meta">
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;