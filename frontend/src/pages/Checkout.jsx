import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import { CheckCircle, CreditCard, Truck, ShieldCheck, MapPin, ChevronRight, Lock } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
  }, [user, navigate]);

  if (cart.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const res = await placeOrder({
        items,
        shippingAddress: address
      });

      setOrderData(res);
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass-card success-card animate-fade-in">
          <CheckCircle size={80} color="#2e7d32" className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with us. Your order will be delivered soon.</p>
          <div className="order-details-summary">
            <div className="detail-row"><span>Order ID:</span> <span>#{orderData?.orderId}</span></div>
            <div className="detail-row"><span>Status:</span> <span className="status-badge">Confirmed</span></div>
            <div className="detail-row total"><span>Total Paid:</span> <span>₹{Number(orderData?.totalAmount).toLocaleString('en-IN')}</span></div>
          </div>
          <div className="success-footer">
            <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
            <Link to="/orders" className="orders-link">View My Orders <ChevronRight size={16}/></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container animate-fade-in">
      <div className="checkout-header-minimal">
          <Link to="/" className="checkout-logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
            <span className="domain">.in</span>
          </Link>
          <div className="checkout-title-wrap">
            <h1>Checkout ({cart.length} items)</h1>
            <div className="checkout-secure"><Lock size={16}/> Secure Transaction</div>
          </div>
      </div>

      <div className="checkout-steps-nav">
        <div className={`step-nav-item ${step >= 1 ? 'active' : ''}`}>1. Address</div>
        <div className="step-nav-line"></div>
        <div className={`step-nav-item ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
        <div className={`step-nav-item ${step >= 3 ? 'active' : ''}`}>3. Review</div>
      </div>
      
      <div className="checkout-grid">
        <div className="checkout-main-content">
          
          {/* STEP 1: ADDRESS */}
          <div className={`checkout-section ${step === 1 ? 'active' : 'collapsed'}`}>
            <div className="section-header" onClick={() => step > 1 && setStep(1)}>
               <span className="section-number">1</span>
               <h3>Shipping Address</h3>
               {step > 1 && <span className="change-btn">Change</span>}
            </div>
            {step === 1 && (
              <div className="section-body animate-slide-down">
                <textarea 
                  className="input-base address-input"
                  rows="4" 
                  placeholder="Enter your full address (House No, Street, City, Pincode)..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
                <div className="address-actions">
                    <button 
                      className="btn btn-primary btn-amazon-gold" 
                      disabled={!address.trim()} 
                      onClick={() => setStep(2)}
                    >
                      Use this address
                    </button>
                </div>
              </div>
            )}
            {step > 1 && <div className="section-summary">{address}</div>}
          </div>

          {/* STEP 2: PAYMENT */}
          <div className={`checkout-section ${step === 2 ? 'active' : step < 2 ? 'disabled' : 'collapsed'}`}>
            <div className="section-header" onClick={() => step > 2 && setStep(2)}>
               <span className="section-number">2</span>
               <h3>Payment Method</h3>
               {step > 2 && <span className="change-btn">Change</span>}
            </div>
            {step === 2 && (
              <div className="section-body animate-slide-down">
                <div className="payment-options">
                   <div className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                      <div className="option-radio"></div>
                      <div className="option-info">
                         <span className="option-title"><CreditCard size={18}/> Credit or Debit Card</span>
                         {paymentMethod === 'card' && (
                           <div className="card-form animate-fade-in" onClick={e => e.stopPropagation()}>
                              <input type="text" placeholder="Card number" maxLength="19" className="input-base" />
                              <div className="field-row">
                                <input type="text" placeholder="MM/YY" maxLength="5" className="input-base" />
                                <input type="password" placeholder="CVV" maxLength="3" className="input-base" />
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                   
                   <div className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                      <div className="option-radio"></div>
                      <div className="option-info">
                         <span className="option-title">UPI (Google Pay, PhonePe, etc.)</span>
                         {paymentMethod === 'upi' && (
                            <input type="text" placeholder="Enter UPI ID" className="input-base" onClick={e=>e.stopPropagation()} />
                         )}
                      </div>
                   </div>

                   <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                      <div className="option-radio"></div>
                      <div className="option-info">
                         <span className="option-title">Cash on Delivery (COD)</span>
                      </div>
                   </div>
                </div>
                <div className="address-actions">
                    <button className="btn btn-primary btn-amazon-gold" onClick={() => setStep(3)}>Continue to Review</button>
                </div>
              </div>
            )}
            {step > 2 && <div className="section-summary">{paymentMethod.toUpperCase()} - Payment method selected</div>}
          </div>

          {/* STEP 3: REVIEW */}
          <div className={`checkout-section ${step === 3 ? 'active' : 'disabled'}`}>
            <div className="section-header">
               <span className="section-number">3</span>
               <h3>Items and shipping</h3>
            </div>
            {step === 3 && (
              <div className="section-body animate-slide-down">
                 <div className="review-items">
                    {cart.map(item => (
                      <div key={item.id} className="review-item">
                         <img src={item.image_url} alt={item.name} />
                         <div className="review-item-info">
                            <div className="name">{item.name}</div>
                            <div className="price">₹{Number(item.price).toLocaleString('en-IN')} x {item.quantity}</div>
                            <div className="delivery-est"><Truck size={14}/> Fast delivery by Amazon</div>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="place-order-banner">
                    <button 
                      className="btn btn-primary btn-amazon-gold place-order-final-btn"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place your order and pay'}
                    </button>
                    <p>By placing your order, you agree to Amazon's privacy notice and conditions of use.</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <div className="checkout-sidebar">
          <div className="glass-card summary-card sticky">
            {step < 3 && (
               <button 
                  className="btn btn-primary btn-amazon-gold btn-full continue-checkout-summary"
                  disabled={step === 1 ? !address.trim() : false}
                  onClick={() => setStep(prev => prev + 1)}
               >
                 Continue
               </button>
            )}
            {step === 3 && (
               <button 
                  className="btn btn-primary btn-amazon-gold btn-full"
                  onClick={handlePlaceOrder}
                  disabled={loading}
               >
                 {loading ? 'Processing...' : 'Place your order'}
               </button>
            )}
            
            <p className="summary-disclaimer">Choose a payment method to continue checking out. You'll still have a chance to review and edit your order before it's final.</p>
            
            <div className="divider"></div>
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items:</span>
              <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span className="free">FREE</span>
            </div>
            <div className="divider"></div>
            <div className="summary-total">
               <span>Order Total:</span>
               <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="help-card glass-card">
             <ShieldCheck size={20} color="#888" />
             <p>Safe and Secure Payments. 100% Purchase Protection from Amazon.</p>
          </div>
        </div>
      </div>
      
      {error && <div className="floating-error-msg">{error}</div>}
    </div>
  );
};

export default Checkout;
