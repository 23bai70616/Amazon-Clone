import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageSquare, Phone, Mail, HelpCircle, ArrowLeft } from 'lucide-react';
import './Support.css';

const Support = () => {
  const [activeTab, setActiveTab] = useState('common');

  const topics = [
    { title: 'Track your package', desc: 'Real-time status of your delivery', icon: <HelpCircle size={20}/> },
    { title: 'Returns & Refunds', desc: 'Process a return or check refund status', icon: <HelpCircle size={20}/> },
    { title: 'Payments & Pricing', desc: 'Billing issues and payment methods', icon: <HelpCircle size={20}/> },
    { title: 'Prime Membership', desc: 'Benefits and subscription management', icon: <HelpCircle size={20}/> }
  ];

  return (
    <div className="support-page container animate-fade-in">
       <div className="support-hero">
          <h1>Hello. What can we help you with?</h1>
          <div className="support-search hide-mobile">
             <input type="text" placeholder="Search our help topics..." />
          </div>
       </div>

       <div className="support-grid">
          {/* Main Topics */}
          <div className="support-topics">
             <h2>Common Help Topics</h2>
             <div className="topic-list">
                {topics.map((t, idx) => (
                   <div key={idx} className="topic-card glass-card">
                      <div className="topic-icon">{t.icon}</div>
                      <div className="topic-info">
                         <h3>{t.title}</h3>
                         <p>{t.desc}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Contact Methods */}
          <div className="contact-sidebar">
             <div className="contact-card glass-card">
                <h2>Contact Us</h2>
                <p>Most issues are resolved online within minutes.</p>
                
                <div className="contact-methods">
                   <div className="method-item">
                      <div className="method-icon chat"><MessageSquare size={20}/></div>
                      <div className="method-text">
                         <h4>Start a Chat</h4>
                         <p>Instant support from our agents</p>
                         <button className="btn btn-primary btn-full">Chat Now</button>
                      </div>
                   </div>

                   <div className="method-item">
                      <div className="method-icon phone"><Phone size={20}/></div>
                      <div className="method-text">
                         <h4>Call Me</h4>
                         <p>We'll call you right back</p>
                         <button className="btn btn-secondary-minimal btn-full">Request Call</button>
                      </div>
                   </div>

                   <div className="method-item">
                      <div className="method-icon mail"><Mail size={20}/></div>
                      <div className="method-text">
                         <h4>Email</h4>
                         <p>Response within 24 hours</p>
                         <button className="btn btn-secondary-minimal btn-full">Send Email</button>
                      </div>
                   </div>
                </div>
             </div>

             <Link to="/orders" className="back-link show-mobile">
                <ArrowLeft size={16}/> Back to My Orders
             </Link>
          </div>
       </div>
    </div>
  );
};

export default Support;
