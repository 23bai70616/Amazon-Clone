import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const bannerImages = [
    "https://images-eu.ssl-images-amazon.com/images/G/31/rabhinak/gw_pc/GW-Hero-pc-Budget-store._CB783363148_.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/dharshini/BAU_Hero_3000X1200_LA_2x._CB783385633_.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/ALP/ALWDHero_March26/29th_March_Menhood_PC_2x._CB783600066_.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/shrey/PChero/Live_PC_Hero_Lifestyle_3000x1200-gun._CB785335068_.jpg"
  ];
  
  // Extract search and category from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Using the backend search capabilities
        let url = 'http://localhost:5000/api/products';
        if (searchQuery) {
          url += `?search=${searchQuery}`;
        }
        
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]); // Re-fetch when search changes

  // Carousel controls
  const nextSlide = () => setCurrentSlide((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));

  // Auto slide every 5 seconds
  useEffect(() => {
    if (searchQuery) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="home-wrapper">
        <div className="flex-center" style={{minHeight: '60vh'}}>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-wrapper">
        <div className="flex-center" style={{minHeight: '60vh'}}>
          <div className="error-card glass-card">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {!searchQuery && (
        <div className="home-hero">
          <button className="hero-btn left" onClick={prevSlide}>
            <ChevronLeft size={48} color="#fff" strokeWidth={1} />
          </button>
          
          <div className="hero-slider">
            {bannerImages.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Banner ${index}`} 
                className={`home-hero-image ${index === currentSlide ? 'active' : ''}`} 
              />
            ))}
          </div>

          <button className="hero-btn right" onClick={nextSlide}>
            <ChevronRight size={48} color="#fff" strokeWidth={1} />
          </button>
        </div>
      )}
      
      <div className={`home-content ${searchQuery ? 'results-view' : ''}`}>
        {searchQuery && (
          <div className="search-status-bar glass-card">
             <h1>Results for "{searchQuery}"</h1>
             <p>{products.length} items found</p>
          </div>
        )}

        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="no-products glass-card">
               <h2>No results for "{searchQuery}"</h2>
               <p>Try checking your spelling or use more general terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
