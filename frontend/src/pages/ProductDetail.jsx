import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, Lock, MapPin, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL;
        const apiUrl = baseUrl ? (baseUrl.endsWith('/api') ? `${baseUrl}/products/${id}` : `${baseUrl}/api/products/${id}`) : `http://localhost:5000/api/products/${id}`;
        const { data } = await axios.get(apiUrl);
        setProduct(data);
      } catch (err) {
        setError('Product not found.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading-container">Loading product details...</div>;
  if (error || !product) return <div className="error-container">{error}</div>;

  return (
    <div className="product-detail-page animate-fade-in">
      <div className="detail-grid">
        {/* LEFT COLUMN: IMAGE */}
        <div className="image-section">
          <img src={product.image_url} alt={product.name} />
        </div>

        {/* MIDDLE COLUMN: INFO */}
        <div className="info-section">
          <div className="brand-link">
            Visit the {product.category_name} Store
          </div>
          <h1>{product.name}</h1>
          
          <div className="rating-block">
            <div className="stars">
              <Star size={16} fill="#ffa41c" color="#ffa41c" />
              <Star size={16} fill="#ffa41c" color="#ffa41c" />
              <Star size={16} fill="#ffa41c" color="#ffa41c" />
              <Star size={16} fill="#ffa41c" color="#ffa41c" />
              <Star size={16} fill="none" color="#ffa41c" />
            </div>
            <span className="rating-count">1,234 ratings | Search this page</span>
          </div>

          <div className="divider"></div>

          <div className="price-block">
            <span className="price-symbol">₹</span>
            <span className="price-amount">{Number(product.price).toLocaleString('en-IN')}</span>
          </div>
          <div className="tax-info">Inclusive of all taxes</div>

          <div className="divider"></div>

          <div className="about-section">
            <h3>About this item</h3>
            <div className="description">
              <p>{product.description}</p>
              <ul>
                <li>High performance and reliability.</li>
                <li>Designed for comfort and efficiency.</li>
                <li>Premium materials and build quality.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PURCHASE CARD */}
        <div className="purchase-column">
          <div className="purchase-card glass-card">
            <div className="price-tag">₹{Number(product.price).toLocaleString('en-IN')}</div>
            
            <div className="delivery-info">
              <span className="free-del">FREE delivery</span> <b>Tomorrow</b>. Order within <span className="timer">14 hrs 22 mins</span>.
            </div>

            <div className="location-info">
              <MapPin size={16} />
              <span>Deliver to Mumbai 400001</span>
            </div>

            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Currently unavailable</span>
              )}
            </div>

            <div className="action-buttons">
              <button 
                className="btn-amazon-cart"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
              <button 
                className="btn-amazon-buy"
                onClick={() => {
                  addToCart(product);
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>

            <div className="secure-info">
              <Lock size={14} />
              <span>Secure transaction</span>
            </div>

            <div className="wishlist-action">
              <button 
                className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                {isInWishlist(product.id) ? 'Added to Wish List' : 'Add to Wish List'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
