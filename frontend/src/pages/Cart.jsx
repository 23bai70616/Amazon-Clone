import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="container empty-cart-page animate-fade-in">
        <div className="empty-cart-card glass-card">
          <div className="empty-cart-header">
            <h1>Your Amazon Cart is empty</h1>
            <p>Shop today’s deals and add items to your cart.</p>
          </div>

          <div className="empty-cart-body">
            <div className="empty-cart-illustration">
              <img
                src="https://cdn-icons-png.flaticon.com/512/263/263127.png"
                alt="Empty cart"
                loading="lazy"
              />
            </div>

            <div className="empty-cart-actions">
              {!user && (
                <>
                  <Link to="/login" className="btn btn-primary btn-full">
                    Sign in to your account
                  </Link>
                  <Link to="/login" className="btn btn-outline-btn btn-full" style={{ marginBottom: '10px' }}>
                    Sign up now
                  </Link>
                </>
              )}
              <Link to="/" className="btn btn-secondary btn-full">
                Continue shopping
              </Link>
            </div>
          </div>

          <div className="empty-cart-footer">
            <p>Price and availability of items are subject to change. The shopping cart is a temporary place to store items.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-grid">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item glass-card">
              <Link to={`/product/${item.id}`} className="item-img-wrapper">
                <img src={item.image_url} alt={item.name} />
              </Link>
              
              <div className="item-details">
                <Link to={`/product/${item.id}`}>
                  <h3 className="item-name">{item.name}</h3>
                </Link>
                <div className="item-price">
                  ₹{Number(item.price).toLocaleString('en-IN')}
                  <span className="item-subtotal"> (Total: ₹{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString('en-IN')})</span>
                </div>
                
                <div className="item-actions">
                  <div className="qty-controls">
                    <button 
                      className="qty-btn input-base"
                      onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-display">{Number(item.quantity)}</span>
                    <button 
                      className="qty-btn input-base"
                      onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                      disabled={item.stock !== undefined && Number(item.quantity) >= Number(item.stock)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button 
                    className="delete-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary glass-card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cart.reduce((a,c) => a + c.quantity, 0)}):</span>
            <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Shipping & handling:</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <span>Order total:</span>
            <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
          </div>
          
          <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
