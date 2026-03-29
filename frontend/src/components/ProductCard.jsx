import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="glass-card product-card">
      <Link to={`/product/${product.id}`} className="product-image-container">
        <button 
          className={`wishlist-badge ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label="Toggle Wishlist"
        >
          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
        </button>
        <img src={product.image_url} alt={product.name} className="product-image" loading="lazy" />
        {Number(product.stock) >= 1 && Number(product.stock) <= 10 && (
          <span className="low-stock-badge">Only {product.stock} left</span>
        )}
      </Link>
      
      <div className="product-info">
        <span className="product-category">{product.category_name}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-footer">
          <div className="price-tag">₹{Number(product.price).toLocaleString('en-IN')}</div>
          <button 
            className="btn btn-primary add-to-cart-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={18} />
            {product.stock === 0 ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
