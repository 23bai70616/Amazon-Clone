import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Notifications.css';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((product, type = 'cart') => {
    const id = Date.now();
    const newNotification = { id, product, type };
    
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    const newNotification = { id, message, type, isSimple: true };
    
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, showNotification }}>
      {children}
      
      <div className="notification-container">
        {notifications.map((notif) => (
          <div key={notif.id} className={`toast-notification animate-slide-left ${notif.isSimple ? 'simple-' + notif.type : ''}`}>
            <div className="toast-header">
              <CheckCircle size={18} color={notif.type === 'error' ? '#c40000' : '#007600'} fill={notif.type === 'error' ? '#c40000' : '#007600'} />
              <span>{notif.isSimple ? (notif.type === 'success' ? 'Success' : 'Problem') : (notif.type === 'cart' ? 'Added to Cart' : 'Added to Wish List')}</span>
              <button onClick={() => removeNotification(notif.id)}>
                <X size={14} />
              </button>
            </div>
            
            <div className="toast-body">
              {notif.isSimple ? (
                <div className="toast-info">
                  <span className="product-name">{notif.message}</span>
                </div>
              ) : (
                <>
                  <img src={notif.product?.image_url} alt={notif.product?.name} />
                  <div className="toast-info">
                    <span className="product-name">{notif.product?.name}</span>
                    {notif.type === 'cart' ? (
                      <Link to="/cart" className="view-cart-link">
                        View Cart <ChevronRight size={12} />
                      </Link>
                    ) : (
                      <Link to="/wishlist" className="view-cart-link">
                        View List <ChevronRight size={12} />
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
