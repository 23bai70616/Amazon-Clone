import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();
  const [showLangPopup, setShowLangPopup] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="amazon-footer">
      {!user && (
        <div className="footer-signin">
          <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0'}}>
            <div style={{width: '100%', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', color: '#000'}}>
              <p style={{fontSize: '0.85rem', marginBottom: '5px'}}>See personalized recommendations</p>
              <Link to="/login" className="btn-primary" style={{width: '230px', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Sign in</Link>
              <p style={{fontSize: '0.75rem', marginTop: '5px'}}>New customer? <Link to="/login" className="link">Start here.</Link></p>
            </div>
          </div>
        </div>
      )}
      
      <div className="back-to-top" onClick={scrollToTop}>
        Back to top
      </div>
      
      <div className="footer-links-container">
        <div className="footer-cols container">
          <div className="footer-col">
            <h3>Get to Know Us</h3>
            <ul>
              <li><a href="#">About Amazon</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Releases</a></li>
              <li><a href="#">Amazon Science</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Connect with Us</h3>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Make Money with Us</h3>
            <ul>
              <li><a href="#">Sell on Amazon</a></li>
              <li><a href="#">Sell under Amazon Accelerator</a></li>
              <li><a href="#">Protect and Build Your Brand</a></li>
              <li><a href="#">Amazon Global Selling</a></li>
              <li><a href="#">Supply to Amazon</a></li>
              <li><a href="#">Become an Affiliate</a></li>
              <li><a href="#">Fulfilment by Amazon</a></li>
              <li><a href="#">Advertise Your Products</a></li>
              <li><a href="#">Amazon Pay on Merchants</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Let Us Help You</h3>
            <ul>
              <li><a href="#">Your Account</a></li>
              <li><a href="#">Returns Centre</a></li>
              <li><a href="#">Recalls and Product Safety Alerts</a></li>
              <li><a href="#">100% Purchase Protection</a></li>
              <li><a href="#">Amazon App Download</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-line">
        <div className="container footer-line-content">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="footer-logo" />
          <div className="footer-settings">
            <div 
              className="footer-btn language-selector-btn" 
              onMouseEnter={() => setShowLangPopup(true)}
              onMouseLeave={() => setShowLangPopup(false)}
            >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Globe size={15} style={{marginRight: '6px'}}/>
                <span>English</span>
                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '6px', opacity: 0.8, fontSize: '8px', lineHeight: 1, gap: '1px'}}>
                  <span>▲</span>
                  <span>▼</span>
                </div>
              </div>
              
              {showLangPopup && (
                <div className="language-popup-overlay">
                  <div className="popup-arrow"></div>
                  <div className="popup-content">
                    <p style={{fontSize: '13px', color: '#555', marginBottom: '8px'}}>Change Language</p>
                    <label className="lang-radio"><input type="radio" name="lang" defaultChecked /> English - EN</label>
                    <hr style={{margin: '8px 0', border: 'none', borderTop: '1px solid #eee'}}/>
                    <label className="lang-radio"><input type="radio" name="lang" /> हिन्दी - HI</label>
                    <label className="lang-radio"><input type="radio" name="lang" /> தமிழ் - TA</label>
                    <label className="lang-radio"><input type="radio" name="lang" /> తెలుగు - TE</label>
                    <label className="lang-radio"><input type="radio" name="lang" /> ಕನ್ನಡ - KN</label>
                    <label className="lang-radio"><input type="radio" name="lang" /> മലയാളം - ML</label>
                    <label className="lang-radio"><input type="radio" name="lang" /> বাংলা - BN</label>
                    <label className="lang-radio"><input type="radio" name="lang" /> मराठी - MR</label>
                  </div>
                </div>
              )}
            </div>
            <button className="footer-btn" style={{display: 'flex', alignItems: 'center'}}>
              <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" style={{width: '18px', marginRight: '6px', border: '1px solid #555'}} alt="India flag" />
              India
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-cols">
          <div className="bottom-col">
            <a href="#"><strong>AbeBooks</strong><br/>Books, art<br/>& collectibles</a>
            <br/><br/>
            <a href="#"><strong>Shopbop</strong><br/>Designer<br/>Fashion Brands</a>
          </div>
          <div className="bottom-col">
            <a href="#"><strong>Amazon Web Services</strong><br/>Scalable Cloud<br/>Computing Services</a>
            <br/><br/>
            <a href="#"><strong>Amazon Business</strong><br/>Everything For<br/>Your Business</a>
          </div>
          <div className="bottom-col">
            <a href="#"><strong>Audible</strong><br/>Download<br/>Audio Books</a>
            <br/><br/>
            <a href="#"><strong>Amazon Prime Music</strong><br/>100 million songs, ad-free<br/>Over 15 million podcast episodes</a>
          </div>
          <div className="bottom-col">
            <a href="#"><strong>IMDb</strong><br/>Movies, TV<br/>& Celebrities</a>
          </div>
        </div>
      </div>
      <div className="footer-copyright" style={{textAlign: 'center', padding: '10px 0 30px', backgroundColor: 'var(--amazon-dark)', fontSize: '0.75rem', color: '#ddd'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '5px'}}>
          <a href="#" style={{color: '#fff', textDecoration: 'none'}}>Conditions of Use & Sale</a>
          <a href="#" style={{color: '#fff', textDecoration: 'none'}}>Privacy Notice</a>
          <a href="#" style={{color: '#fff', textDecoration: 'none'}}>Interest-Based Ads</a>
        </div>
        <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default Footer;
