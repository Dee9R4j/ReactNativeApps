import { useNavigate } from 'react-router-dom';
import { X, Trash, ShoppingCart } from 'lucide-react';
import { useShop } from '../Context/ShopContext';
import './Wishlist.css';
import { useState } from 'react';

const Wishlist = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useShop();
  const [hiddenItems, setHiddenItems] = useState({});

  const moveToCart = (item) => {
    dispatch({ 
      type: "MOVE_TO_CART", 
      payload: item 
    });
    setHiddenItems(prev => ({ ...prev, [item.id]: true }));
  };

  const removeFromWishlist = (id) => {
    setHiddenItems(prev => ({ ...prev, [id]: true }));
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  };

  return (
    <div className="wishlist-container">
      <button className="close-button" onClick={() => navigate('/')}>
        <X size={24} />
      </button>
      <h2>Wishlist</h2>
      
      {state.wishlist.length === 0 ? (
        <p className="empty-message">Your wishlist is empty.</p>
      ) : (
        state.wishlist.map((item) => (
          !hiddenItems[item.id] && (
            <div key={item.id} className="wishlist-item">
              <img src={item.photo1} alt={item.name} className="wishlist-item-image" />
              <div className="wishlist-item-info">
                <h3>{item.name}</h3>
                <p>₹{item.price.toFixed(2)}</p>
              </div>
              <div className="wishlist-actions">
                <button 
                  className="move-to-cart"
                  onClick={() => moveToCart(item)}
                >
                  <ShoppingCart size={20} />
                </button>
                <button 
                  className="remove-item"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          )
        ))
      )}
    </div>
  );
};

export default Wishlist;