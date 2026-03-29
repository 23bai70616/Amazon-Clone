import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, HeartOff, ShoppingCart } from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-page container animate-fade-in">
        <div className="empty-wishlist-card glass-card">
          <div className="empty-wishlist-content">
            <div className="empty-icon-wrapper">
              <HeartOff size={64} className="heart-off-icon" />
            </div>
            <h1>Your Wish List is empty</h1>
            <p>Save your favorite items here to track their price and availability.</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container animate-fade-in">
      <div className="wishlist-header">
        <h1>Your Wish List</h1>
        <p>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-item glass-card">
            <div className="item-remove-top" onClick={() => removeFromWishlist(product.id)}>
              <Trash2 size={18} />
            </div>
            <Link to={`/product/${product.id}`} className="item-image-container">
              <img src={product.image_url} alt={product.name} />
            </Link>
            <div className="item-info">
              <Link to={`/product/${product.id}`}>
                <h3 className="item-name">{product.name}</h3>
              </Link>
              <div className="item-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
              
              <div className="item-actions">
                <button 
                  className="btn btn-primary btn-full-width"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button 
                  className="btn-text-only"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  Remove from List
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
