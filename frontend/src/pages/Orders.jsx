import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyOrders, cancelOrder, getProductById } from '../services/api';
import { Package, ChevronRight, ShoppingBag, XCircle, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await cancelOrder(orderId);
      // Refresh list
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleBuyAgain = async (item) => {
    addToCart({
      id: item.product_id,
      name: item.name,
      price: item.price_at_time,
      image_url: item.image_url,
      stock: 100
    });
  };

  const handleTrackPackage = (orderId) => {
    navigate(`/orders/${orderId}/track`);
  };

  if (loading) return <div className="container flex-center" style={{minHeight: '60vh'}}><div className="loader"></div></div>;

  return (
    <div className="orders-page container animate-fade-in">
      <div className="orders-breadcrumb">
         <Link to="/">Your Account</Link> <ChevronRight size={14}/> <span>Your Orders</span>
      </div>
      
      <div className="orders-header">
         <h1>Your Orders</h1>
         <div className="orders-tabs">
            <span className="active">Orders</span>
            <span>Buy Again</span>
            <span>Not Yet Shipped</span>
            <span>Cancelled</span>
         </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card empty-orders-card">
           <ShoppingBag size={48} color="#ccc" />
           <p>You haven't placed any orders yet.</p>
           <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
           {orders.map(order => (
             <div key={order.id} className="order-card glass-card">
                <div className="order-card-header">
                   <div className="header-col">
                      <span className="label">ORDER PLACED</span>
                      <span className="val">{new Date(order.created_at).toLocaleDateString()}</span>
                   </div>
                   <div className="header-col hide-mobile">
                      <span className="label">TOTAL</span>
                      <span className="val">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                   </div>
                   <div className="header-col hide-mobile">
                      <span className="label">SHIP TO</span>
                      <span className="val user-link">Guest User</span>
                   </div>
                   <div className="header-col order-id-col">
                      <span className="label">ORDER # {order.id}</span>
                      <div className="header-links">
                        <Link to="#">View order details</Link> | <Link to="#">Invoice</Link>
                      </div>
                   </div>
                </div>

                <div className="order-card-body">
                   <div className="order-status-info">
                      <h3 className={order.status === 'cancelled' ? 'status-cancelled' : ''}>
                        Status: {order.status.toUpperCase()}
                      </h3>
                      <p className={order.status === 'cancelled' ? 'cancelled-text' : ''}>
                        {order.status === 'cancelled' 
                          ? 'This order has been cancelled. If payment was made, a refund will be processed.' 
                          : 'Your package was delivered based on the order lifecycle.'}
                      </p>
                   </div>
                   
                   <div className="order-items-list">
                      {order.items?.map(item => (
                        <div key={item.id} className="order-item">
                           <img src={item.image_url} alt={item.name} />
                           <div className="item-info">
                              <Link to={`/product/${item.product_id}`} className="item-name">{item.name}</Link>
                              <div className="item-desc">Quantity: {item.quantity}</div>
                              <div className="item-price">₹{Number(item.price_at_time).toLocaleString('en-IN')}</div>
                              <div className="item-actions-mobile show-mobile">
                                 <span>Total: ₹{(item.price_at_time * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                               <div className="buy-again-row">
                                 <button 
                                  className="btn btn-amazon-buy-again"
                                  onClick={() => handleBuyAgain(item)}
                                 >
                                   <Package size={14}/> Buy it again
                                 </button>
                                 <Link to={`/product/${item.product_id}`} className="btn btn-secondary-minimal">
                                   View your item
                                 </Link>
                               </div>
                           </div>
                           <div className="order-item-actions hide-mobile">
                              <button className="btn btn-primary btn-full" onClick={() => handleTrackPackage(order.id)}>
                                Track package
                              </button>
                              
                              {order.status !== 'cancelled' ? (
                                <button 
                                  className="btn btn-danger-outline btn-full"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  <XCircle size={16}/> Cancel items
                                </button>
                              ) : (
                                <button className="btn btn-secondary-minimal btn-full" disabled>
                                  Order Cancelled
                                </button>
                              )}

                              <button className="btn btn-secondary-minimal btn-full">Return or replace items</button>
                              <button className="btn btn-secondary-minimal btn-full">Leave product review</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="order-card-footer">
                   <Link to="#">Archive order</Link>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
