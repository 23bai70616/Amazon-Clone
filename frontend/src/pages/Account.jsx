import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShieldCheck, MapPin, CreditCard, User, Key, MessageSquare } from 'lucide-react';
import './Account.css';

const Account = () => {
  const accountCards = [
    { title: 'Your Orders', desc: 'Track, return, or buy things again', icon: <Package size={40} color="#007185"/>, link: '/orders' },
    { title: 'Login & Security', desc: 'Edit login, name, and mobile number', icon: <Key size={40} color="#007185"/>, link: '#' },
    { title: 'Prime', desc: 'View benefits and payment settings', icon: <ShieldCheck size={40} color="#007185"/>, link: '#' },
    { title: 'Your Addresses', desc: 'Edit addresses for orders and gifts', icon: <MapPin size={40} color="#007185"/>, link: '#' },
    { title: 'Payment Options', desc: 'Edit or add payment methods', icon: <CreditCard size={40} color="#007185"/>, link: '#' },
    { title: 'Contact Us', desc: 'Chat or call our support agents', icon: <MessageSquare size={40} color="#007185"/>, link: '/support' }
  ];

  return (
    <div className="account-page container animate-fade-in">
       <div className="account-header">
          <h1>Your Account</h1>
       </div>

       <div className="account-grid">
          {accountCards.map((card, idx) => (
             <Link key={idx} to={card.link} className="account-card glass-card">
                <div className="account-card-icon">
                   {card.icon}
                </div>
                <div className="account-card-info">
                   <h3>{card.title}</h3>
                   <p>{card.desc}</p>
                </div>
             </Link>
          ))}
       </div>

       <div className="divider"></div>

       <div className="account-sections">
          <div className="account-section-col">
             <h2>Digital content and devices</h2>
             <Link to="#">Apps and more</Link>
             <Link to="#">Content and devices</Link>
             <Link to="#">Digital gifts</Link>
          </div>
          <div className="account-section-col">
             <h2>Email alerts, messages, and ads</h2>
             <Link to="#">Advertising preferences</Link>
             <Link to="#">Communication preferences</Link>
             <Link to="#">Message Center</Link>
          </div>
          <div className="account-section-col">
             <h2>More ways to pay</h2>
             <Link to="#">Amazon Pay balance</Link>
             <Link to="#">Redeem a Gift Card</Link>
             <Link to="#">Reload your Balance</Link>
          </div>
       </div>
    </div>
  );
};

export default Account;
