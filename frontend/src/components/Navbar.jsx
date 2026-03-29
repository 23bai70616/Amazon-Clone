import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, Menu, User, X, ChevronRight, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { validatePincodeUrl } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("All Categories");
  const [pincodeInput, setPincodeInput] = useState('');
  const [locationObj, setLocationObj] = useState({ city: 'Mumbai', pincode: '400001' });
  const [locationError, setLocationError] = useState('');
  const [selectedLang, setSelectedLang] = useState('EN');

  useEffect(() => {
    const savedLoc = localStorage.getItem('amazon-location');
    if (savedLoc) {
      setLocationObj(JSON.parse(savedLoc));
    }
    const savedLang = localStorage.getItem('amazon-lang');
    if (savedLang) {
      setSelectedLang(savedLang);
    }
  }, []);

  const handleApplyLocation = async () => {
    setLocationError('');
    if (!/^\d{6}$/.test(pincodeInput)) {
      setLocationError('Please enter a valid 6-digit PIN code');
      return;
    }
    try {
      const data = await validatePincodeUrl(pincodeInput);
      if (data.valid) {
        const newLoc = { city: data.city, pincode: data.pincode };
        setLocationObj(newLoc);
        localStorage.setItem('amazon-location', JSON.stringify(newLoc));
        setIsLocationOpen(false);
        setPincodeInput('');
      }
    } catch (err) {
      setLocationError(err.response?.data?.message || 'Invalid PIN code');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query) {
      navigate(`/?search=${query}`);
    } else {
      navigate(`/`);
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem('amazon-lang', lang);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="amazon-header">
      {/* Top Navbar */}
      <div className="nav-main">
        <Link to="/" className="nav-logo border-hover">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
          <span className="domain">.in</span>
        </Link>

        <div className="nav-location border-hover" onClick={() => setIsLocationOpen(true)}>
          <div className="loc-icon"><MapPin size={18} /></div>
          <div className="loc-text">
            <span className="loc-line-1">Delivering to {locationObj.city} {locationObj.pincode}</span>
            <span className="loc-line-2">Update location</span>
          </div>
        </div>

        <form className="nav-search" onSubmit={handleSearch}>
          <div className="search-facade">
            <span className="search-label">{searchCategory === 'All Categories' ? 'All' : searchCategory}</span>
            <select 
              className="search-dropdown" 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
            <option value="Alexa Skills">Alexa Skills</option>
            <option value="Amazon Devices">Amazon Devices</option>
            <option value="Amazon Fashion">Amazon Fashion</option>
            <option value="Amazon Fresh">Amazon Fresh</option>
            <option value="Amazon Pharmacy">Amazon Pharmacy</option>
            <option value="Appliances">Appliances</option>
            <option value="Apps & Games">Apps & Games</option>
            <option value="Audible Audiobooks">Audible Audiobooks</option>
            <option value="Baby">Baby</option>
            <option value="Beauty">Beauty</option>
            <option value="Books">Books</option>
            <option value="Car & Motorbike">Car & Motorbike</option>
            <option value="Clothing & Accessories">Clothing & Accessories</option>
            <option value="Collectibles">Collectibles</option>
            <option value="Computers & Accessories">Computers & Accessories</option>
            <option value="Deals">Deals</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Garden & Outdoors">Garden & Outdoors</option>
            <option value="Gift Cards">Gift Cards</option>
            <option value="Grocery & Gourmet Foods">Grocery & Gourmet Foods</option>
            <option value="Health & Personal Care">Health & Personal Care</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Industrial & Scientific">Industrial & Scientific</option>
            <option value="Jewellery">Jewellery</option>
            <option value="Kindle Store">Kindle Store</option>
            <option value="Luggage & Bags">Luggage & Bags</option>
            <option value="Luxury Beauty">Luxury Beauty</option>
            <option value="Movies & TV Shows">Movies & TV Shows</option>
            <option value="MP3 Music">MP3 Music</option>
            <option value="Music">Music</option>
            <option value="Musical Instruments">Musical Instruments</option>
          </select>
          </div>
          <input
            type="text"
            name="search"
            placeholder="Search Amazon.in"
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <Search size={22} color="#111" />
          </button>
        </form>

        <div className="nav-tools">
          <div className="nav-lang-container">
            <div className="nav-lang border-hover">
              <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="IN" className="flag" style={{marginTop: '10px'}} />
              <div style={{fontWeight: 700, fontSize: '14px', marginTop: '10px', display: 'flex', alignItems: 'center'}}>
                {selectedLang} <span className="caret" style={{marginLeft: '2px', borderTopColor: '#a7acb2'}}></span>
              </div>
            </div>
            
            <div className="nav-language-dropdown">
              <div className="nav-popup-arrow"></div>
              <div className="nav-popup-content">
                <div style={{marginBottom: '10px', fontSize: '13px', color: '#111'}}>
                  Change Language <a href="#" style={{color: '#007185', textDecoration: 'none', marginLeft: '5px', fontSize: '12px'}}>Learn more</a>
                </div>
                
                <label className="nav-lang-radio">
                  <input 
                    type="radio" 
                    name="nav-lang" 
                    checked={selectedLang === 'EN'} 
                    onChange={() => handleLanguageChange('EN')}
                  /> 
                  <span>English - EN</span>
                </label>
                
                <div className="nav-lang-divider"></div>

                <label className="nav-lang-radio">
                  <input type="radio" name="nav-lang" checked={selectedLang === 'HI'} onChange={() => handleLanguageChange('HI')}/>
                  <span>हिन्दी - HI</span>
                </label>
                <label className="nav-lang-radio">
                  <input type="radio" name="nav-lang" checked={selectedLang === 'TA'} onChange={() => handleLanguageChange('TA')}/>
                  <span>தமிழ் - TA</span>
                </label>
                <label className="nav-lang-radio">
                  <input type="radio" name="nav-lang" checked={selectedLang === 'TE'} onChange={() => handleLanguageChange('TE')}/>
                  <span>తెలుగు - TE</span>
                </label>
                <label className="nav-lang-radio">
                  <input type="radio" name="nav-lang" checked={selectedLang === 'KN'} onChange={() => handleLanguageChange('KN')}/>
                  <span>ಕನ್ನಡ - KN</span>
                </label>
                <label className="nav-lang-radio">
                  <input type="radio" name="nav-lang" checked={selectedLang === 'ML'} onChange={() => handleLanguageChange('ML')}/>
                  <span>മലയാളം - ML</span>
                </label>
                <label className="nav-lang-radio">
                  <input type="radio" name="nav-lang" checked={selectedLang === 'BN'} onChange={() => handleLanguageChange('BN')}/>
                  <span>বাংলা - BN</span>
                </label>
                <label className="nav-lang-radio">
                  <input type="radio" name="nav-lang" checked={selectedLang === 'MR'} onChange={() => handleLanguageChange('MR')}/>
                  <span>मराठी - MR</span>
                </label>

                <div className="nav-lang-divider"></div>

                <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#111'}}>
                  <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="IN" style={{width: '18px'}}/>
                  <span>You are shopping on Amazon.in</span>
                </div>
                
                <div style={{marginTop: '15px', textAlign: 'center'}}>
                  <a href="#" style={{color: '#007185', textDecoration: 'none', fontSize: '13px'}}>Change country/region</a>
                </div>
              </div>
            </div>
          </div>

          <div className="nav-account-container">
            <Link to={user ? "/account" : "/login"} className="nav-account border-hover">
              <span className="line-1">Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
              <span className="line-2">Account & Lists <span className="caret"></span></span>
            </Link>
            
            <div className="nav-account-dropdown">
              <div className="nav-account-arrow"></div>
              <div className="nav-account-content">
                {!user && (
                  <div className="nav-account-signin">
                    <Link to="/login" className="nav-account-signin-btn">Sign in</Link>
                    <div className="nav-account-new">New customer? <Link to="/register" style={{color: '#007185', textDecoration: 'none'}}>Start here.</Link></div>
                  </div>
                )}
                
                <div className="nav-account-columns">
                  <div className="nav-account-col" style={{paddingRight: '15px'}}>
                    <h3>Your Lists</h3>
                    <ul>
                      <li><Link to="/wishlist">Create a Wish List</Link></li>
                      <li><a href="#">Wish from Any Website</a></li>
                      <li><a href="#">Baby Wishlist</a></li>
                      <li><a href="#">Discover Your Style</a></li>
                      <li><a href="#">Explore Showroom</a></li>
                    </ul>
                  </div>
                  
                  <div className="nav-account-col nav-account-col-right">
                    <h3>Your Account</h3>
                    <ul>
                      <li><Link to="/account">Your Account</Link></li>
                      <li><Link to="/orders">Your Orders</Link></li>
                      <li><Link to="/wishlist">Your Wish List</Link></li>
                      <li><Link to="#">Keep shopping for</Link></li>
                      <li><Link to="#">Your Recommendations</Link></li>
                      <li><Link to="#">Your Prime Membership</Link></li>
                      <li><Link to="#">Your Prime Video</Link></li>
                      <li><Link to="#">Your Subscribe & Save Items</Link></li>
                      <li><Link to="#">Memberships & Subscriptions</Link></li>
                      <li><Link to="#">Your Seller Account</Link></li>
                      <li><Link to="#">Manage Your Content and Devices</Link></li>
                      <li><Link to="#">Register for a free Business Account</Link></li>
                      {user && (
                        <>
                          <div className="nav-lang-divider" style={{margin: '10px 0'}}></div>
                          <li onClick={logoutUser} style={{cursor: 'pointer'}}>Sign Out</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link to={user ? "/orders" : "/login"} className="nav-orders border-hover">
            <span className="line-1">Returns</span>
            <span className="line-2">& Orders</span>
          </Link>

          <Link to="/cart" className="nav-cart border-hover">
            <div className="cart-container">
              <span className="cart-count">{cartItemsCount}</span>
              <ShoppingCart size={34} strokeWidth={1.5} />
            </div>
            <span className="cart-text line-2">Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub Navbar */}
      <div className="nav-sub">
        <div className="sub-item menu-all border-hover" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={20} />
          <span>All</span>
        </div>
        <div className="sub-item border-hover">Rufus</div>
        <div className="sub-item border-hover">Fresh</div>
        <div className="sub-item border-hover">Flights</div>
        <div className="sub-item border-hover">Home & Kitchen</div>
        <div className="sub-item border-hover">MX Player</div>
        <div className="sub-item border-hover">Sell</div>
        <div className="sub-item border-hover">Gift Cards</div>
        <div className="sub-item border-hover">Amazon Pay</div>
        <div className="sub-item border-hover">Buy Again</div>
      </div>

      {/* Location Modal Overlay */}
      <div className={`location-overlay ${isLocationOpen ? 'open' : ''}`} onClick={() => setIsLocationOpen(false)}></div>
      
      <div className={`location-modal ${isLocationOpen ? 'open' : ''}`}>
        <div className="location-modal-header">
          <h3>Choose your location</h3>
          <button className="location-close" onClick={() => setIsLocationOpen(false)}>
            <X size={24} color="#0f1111" />
          </button>
        </div>
        <div className="location-modal-body">
          <p className="location-desc">
            Select a delivery location to see product availability and delivery options
          </p>
          {!user ? (
            <button className="location-signin-btn" onClick={() => { setIsLocationOpen(false); navigate('/login'); }}>
              Sign in to see your addresses
            </button>
          ) : (
            <div className="location-addresses">
              {/* Could list user addresses here in the future */}
            </div>
          )}
          
          <div className="location-divider-wrapper">
            <div className="location-divider"></div>
            <span>or enter an Indian pincode</span>
            <div className="location-divider"></div>
          </div>
          
          <div className="location-input-row">
            <input 
              type="text" 
              className="location-pincode-input" 
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              maxLength={6}
            />
            <button className="location-apply-btn" onClick={handleApplyLocation}>Apply</button>
          </div>
          {locationError && <div style={{color: '#c40000', fontSize: '12px', marginTop: '5px'}}>{locationError}</div>}
        </div>
      </div>

      {/* Sidebar Overlay and Menu */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}>
        <button className="sidebar-close-btn" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}>
          <X size={35} color="#fff" strokeWidth={1} />
        </button>
      </div>
      
      <div className={`sidebar-menu ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={user ? undefined : () => { setIsSidebarOpen(false); navigate('/login'); }}>
          <User size={28} />
          <span><b>Hello, {user ? user.name.split(' ')[0] : 'sign in'}</b></span>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3>Trending</h3>
            <ul>
              <li>Bestsellers</li>
              <li>New Releases</li>
              <li>Movers and Shakers</li>
            </ul>
          </div>
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-section">
            <h3>Digital Content and Devices</h3>
            <ul>
              <li className="with-icon">Echo & Alexa <ChevronRight size={18} color="#888" /></li>
              <li className="with-icon">Fire TV <ChevronRight size={18} color="#888" /></li>
              <li className="with-icon">Kindle E-Readers & eBooks <ChevronRight size={18} color="#888" /></li>
              <li className="with-icon">Audible Audiobooks <ChevronRight size={18} color="#888" /></li>
              <li className="with-icon">Amazon Prime Video <ChevronRight size={18} color="#888" /></li>
              <li className="with-icon">Amazon Prime Music <ChevronRight size={18} color="#888" /></li>
            </ul>
          </div>
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-section">
            <h3>Shop by Category</h3>
            <ul>
              <li className="with-icon">Mobiles, Computers <ChevronRight size={18} color="#888" /></li>
              <li className="with-icon">TV, Appliances, Electronics <ChevronRight size={18} color="#888" /></li>
              <li className="with-icon">Men's Fashion <ChevronRight size={18} color="#888" /></li>
            </ul>
          </div>
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-section">
            <h3>Programs & Features</h3>
            <ul>
              <li className="with-icon">Gift Cards & Mobile Recharges <ChevronRight size={18} color="#888" /></li>
              <li>Amazon Launchpad</li>
              <li>Amazon Business</li>
              <li>Handloom and Handicrafts</li>
              <li className="with-icon">See all <ChevronDown size={18} color="#888" /></li>
            </ul>
          </div>
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-section">
            <h3>Help & Settings</h3>
            <ul>
              <li><Link to="/account" onClick={() => setIsSidebarOpen(false)}>Your Account</Link></li>
              <li><Link to="/support" onClick={() => setIsSidebarOpen(false)}>Customer Service</Link></li>
              <li onClick={() => { setIsSidebarOpen(false); if(!user) navigate('/login'); else logoutUser(); }}>{user ? 'Sign Out' : 'Sign in'}</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
