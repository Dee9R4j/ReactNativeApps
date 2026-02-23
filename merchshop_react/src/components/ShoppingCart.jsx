import { useNavigate } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import { useShop } from '../Context/ShopContext';
import OrderForm from './OrderForm';
import './ShoppingCart.css';
import { useState } from 'react';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useShop();
  const [hiddenItems, setHiddenItems] = useState(new Set());
  const [showOrderForm, setShowOrderForm] = useState(false);

  const updateQuantity = (id, quantity) => {
    dispatch({
      type: "UPDATE_CART_QUANTITY",
      payload: { id, quantity: Math.max(1, quantity) },
    });
  };

  const removeItem = (id) => {
    setHiddenItems(prev => new Set([...prev, id]));
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const subtotal = state.cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = state.cart.length > 0 ? 60 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="cart-container">
      {showOrderForm && (
        <OrderForm
          onClose={() => setShowOrderForm(false)}
          cartItems={state.cart}
        />
      )}

      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button className="close-button" onClick={() => navigate('/')}>
          <X size={24} />
        </button>
      </div>

      <div className="cart-items">
        {state.cart.map(item => 
          !hiddenItems.has(item.id) && (
            <div key={item.id} className="cart-item">
              <img src={item.photo1} alt={item.name} className="cart-item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price.toFixed(2)}</p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="quantity-input"
                />
              </div>
              <button 
                className="remove-button"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 size={24} />
              </button>
            </div>
          )
        )}
      </div>

      <div className="totalcal">
        <div className="cart-totals">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax (18%): ₹{tax.toFixed(2)}</p>
          <p>Shipping: ₹{shipping.toFixed(2)}</p>
          <p className="cart-total">Total: ₹{total.toFixed(2)}</p>
        </div>
        <button 
          className="checkout-button"
          onClick={() => setShowOrderForm(true)}
          disabled={state.cart.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;