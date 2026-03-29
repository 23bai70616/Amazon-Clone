import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, Package, CheckCircle, Truck, Info } from 'lucide-react';
import { getMyOrders } from '../services/api';
import './TrackOrder.css';

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await getMyOrders();
        // Since we don't have a getOrderById yet, we filter from all orders
        const found = orders.find(o => o.id === parseInt(id));
        setOrder(found);
      } catch (err) {
        console.error('Failed to fetch order details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="container flex-center" style={{minHeight: '60vh'}}><div className="loader"></div></div>;
  if (!order) return <div className="container"><h2>Order Not Found</h2><Link to="/orders">Back to Orders</Link></div>;

  const steps = [
    { label: 'Ordered', date: new Date(order.created_at).toLocaleDateString(), completed: true },
    { label: 'Shipped', date: 'Expected Tomorrow', completed: order.status !== 'pending' && order.status !== 'cancelled' },
    { label: 'Out for delivery', date: 'Upcoming', completed: false },
    { label: 'Arriving', date: 'By 9 PM', completed: false }
  ];

  return (
    <div className="track-order-page container animate-fade-in">
      <div className="orders-breadcrumb">
         <Link to="/orders">Your Orders</Link> <ChevronRight size={14}/> <span>Track Package</span>
      </div>

      <div className="track-header">
         <div className="delivery-summary">
            <h1>Arriving Thursday</h1>
            <p>Your package is on its way!</p>
         </div>
         <div className="track-id hide-mobile">
            <span>Tracking ID: <b>AMZ_IND_{order.id}_XYZ</b></span>
         </div>
      </div>

      <div className="track-grid">
         {/* Tracking Stepper */}
         <div className="track-main glass-card">
            <div className="stepper-container">
               {steps.map((step, index) => (
                 <div key={index} className={`step ${step.completed ? 'completed' : ''}`}>
                    <div className="step-marker">
                       {step.completed ? <CheckCircle size={20} /> : <div className="dot"></div>}
                    </div>
                    <div className="step-info">
                       <span className="step-label">{step.label}</span>
                       <span className="step-date">{step.date}</span>
                    </div>
                    {index < steps.length - 1 && <div className="step-line"></div>}
                 </div>
               ))}
            </div>

            <div className="divider"></div>

            <div className="track-details-list">
               <h3>Update for: <b>{order.items?.[0]?.name}</b></h3>
               <div className="update-item">
                  <span className="time">10:30 AM</span>
                  <div className="update-marker"><div className="pulsing-dot"></div></div>
                  <div className="update-desc">Package arrived at a carrier facility. MUMBAI, MH IN</div>
               </div>
               <div className="update-item">
                  <span className="time">08:15 AM</span>
                  <div className="update-marker"></div>
                  <div className="update-desc">Package departed from an Amazon facility. BENGALURU, KA IN</div>
               </div>
               <div className="update-item muted">
                  <span className="time">Yesterday</span>
                  <div className="update-marker"></div>
                  <div className="update-desc">Package has left the seller facility and is in transit to carrier.</div>
               </div>
            </div>
         </div>

         {/* Info Sidebar */}
         <div className="track-sidebar">
            <div className="glass-card address-card">
               <h3>Delivery Address</h3>
               <p>Guest User</p>
               <p>{order.shipping_address}</p>
               <p>Phone: +91 98765 43210</p>
            </div>

            <div className="glass-card help-card">
               <div className="help-row">
                  <Info size={18} />
                  <span>Something wrong with your order?</span>
               </div>
               <Link to="/orders" className="btn btn-secondary-minimal btn-full">Contact Support</Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TrackOrder;
