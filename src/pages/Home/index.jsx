import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/common/HeroSection';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Checkbox from '../../components/ui/Checkbox';
import ProductCartSection from '../../pages/ProductCartSection'; // ADD THIS IMPORT
import { API_BASE_URL } from '../../api/constant';
import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { useCart } from '@/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PerfumeSlideAnimation from '../../components/PerfumeSlideAnimation/PerfumeSlideAnimation';
import { fadeIn } from '../../variants';
import HeroSectionMobile from '@/components/Mobile/HeroSectionMobile';
import ProductHighlightMobile from '@/components/Mobile/ProductHighlightMobile';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
  ShoppingBag,
  Eye,
  CheckCircle,
  AlertCircle,
  Heart,
  ShoppingCart,
  X
} from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/WishlistContext';
import ProductService from '../../services/productService';
import ScentService from '../../services/scentService';
import CollectionHighlightMobile from '@/components/Mobile/CollectionHighlightMobile';
import ProductCardsMobile from '@/components/Mobile/ProductCardsMobile';

const HomePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef(null);
  const summerScrollRef = useRef(null);
  const signatureScrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summerCurrentIndex, setSummerCurrentIndex] = useState(0);
  const [signatureCurrentIndex, setSignatureCurrentIndex] = useState(0);
  const { addToCart, cartItems, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [expandedSections, setExpandedSections] = useState({});

  // ADD THIS STATE FOR CART SIDEBAR
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Backend data state
  const [collections, setCollections] = useState({
    fragrant_favourites: [],
    summer_scents: [],
    signature_collection: [],
    trending_scents: [],
    best_seller_scents: []
  });

  const [banners, setBanners] = useState({
    hero: null,
    product_highlight: [],
    collection_highlight: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const uiTheme = {
    pageBg: '#F1F0ED',
    ink: '#2A2420',
    muted: '#5F5953',
    border: '#D5D0C8',
    amber: '#D4AF37'
  };

  // Toggle section expansion - MEMOIZED
  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  // UPDATED: Enhanced notification system matching MensCollection
  const [notifications, setNotifications] = useState([]);
  // UPDATED: Enhanced notification helper with proper action type parameter (matching MensCollection)
  const addNotification = useCallback((message, type = 'success', productName = null, actionType = 'cart') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type, productName, actionType }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Load theme preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  //Mobile UI or Desktop Ui
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Enhanced Banner Click Handler
  const handleBannerClick = async (banner) => {
    if (banner && banner._id) {
      try {
        await ProductService.trackBannerClick(banner._id);
      } catch (error) {
        console.error('Error tracking banner click:', error);
      }
    }

    if (banner.buttonLink) {
      navigate(banner.buttonLink);
    } else if (
      banner.type === 'trending_collection' ||
      banner.title?.toLowerCase().includes('trending')
    ) {
      navigate('/trending-collection');
    } else if (
      banner.type === 'best_seller_collection' ||
      banner.title?.toLowerCase().includes('best seller')
    ) {
      navigate('/best-sellers-collection');
    } else {
      console.log('Banner clicked but no specific navigation defined:', banner);
    }
  };



  // Updated fetchHomeData with scent integration
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching home page data...');

        const [productsResponse, bannersResponse, scentsResponse] = await Promise.all([
          ProductService.getHomeCollections().catch((err) => {
            console.error('Products fetch error:', err);
            return { success: false, error: err.message };
          }),
          ProductService.getHomeBanners().catch((err) => {
            console.error('Banners fetch error:', err);
            return { success: false, error: err.message };
          }),
          ScentService.getFeaturedScents().catch((err) => {
            console.error('Scents fetch error:', err);
            return { success: false, error: err.message };
          }),
        ]);

        console.log('Home Products Response:', productsResponse);
        console.log('Home Banners Response:', bannersResponse);
        console.log('Scents Response:', scentsResponse);

        if (productsResponse.success && productsResponse.data) {
          const safeCollections = {
            fragrant_favourites: productsResponse.data.fragrant_favourites || [],
            summer_scents: productsResponse.data.summer_scents || [],
            signature_collection: productsResponse.data.signature_collection || [],
          };

          console.log('✅ Collections processed:', {
            fragrant_favourites: safeCollections.fragrant_favourites.length,
            summer_scents: safeCollections.summer_scents.length,
            signature_collection: safeCollections.signature_collection.length,
          });

          setCollections(safeCollections);
        } else {
          console.warn('⚠️ Products fetch failed or empty:', productsResponse);
          setCollections({
            fragrant_favourites: [],
            summer_scents: [],
            signature_collection: [],
            trending_scents: [],
            best_seller_scents: []
          });
        }

        if (bannersResponse.success && bannersResponse.data) {
          const bannersByType = {
            hero: null,
            product_highlight: [],
            collection_highlight: [],
          };

          (bannersResponse.data || []).forEach((banner) => {
            if (banner.type === 'hero') {
              bannersByType.hero = banner;
            } else if (banner.type === 'product_highlight') {
              bannersByType.product_highlight.push(banner);
            } else if (banner.type === 'collection_highlight') {
              bannersByType.collection_highlight.push(banner);
            }
          });

          setBanners(bannersByType);
          console.log('✅ Banners processed:', bannersByType);
        } else {
          console.warn('⚠️ Banners fetch failed, using empty fallback');
          setBanners({
            hero: null,
            product_highlight: [],
            collection_highlight: [],
          });
        }

        if (scentsResponse.success && scentsResponse.data) {
          const scentsData = scentsResponse.data;
          console.log('✅ Featured scents loaded:', {
            trending: scentsData.trending?.length || 0,
            best_seller: (scentsData.best_seller || scentsData.bestSellers)?.length || 0,
            signature: scentsData.signature?.length || 0,
          });

          setCollections((prev) => ({
            ...prev,
            trending_scents: scentsData.trending || [],
            best_seller_scents: scentsData.best_seller || scentsData.bestSellers || [],
          }));
        }
      } catch (err) {
        console.error('❌ Error fetching home data:', err);
        setError(err.message);

        setCollections({
          fragrant_favourites: [],
          summer_scents: [],
          signature_collection: [],
          trending_scents: [],
          best_seller_scents: []
        });
        setBanners({
          hero: null,
          product_highlight: [],
          collection_highlight: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Navigation functions with safety checks
  const createNavFunction = (products = [], setIndex) => ({
    next: () => {
      if (!products || products.length <= 4) return;
      setIndex((prev) => Math.min(prev + 1, products.length - 4));
    },
    prev: () => {
      if (!products || products.length <= 4) return;
      setIndex((prev) => Math.max(prev - 1, 0));
    },
  });

  const fragrantFavouritesNav = createNavFunction(collections.fragrant_favourites, setCurrentIndex);
  const summerScentsNav = createNavFunction(collections.summer_scents, setSummerCurrentIndex);
  const signatureCollectionNav = createNavFunction(
    collections.signature_collection,
    setSignatureCurrentIndex
  );

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  };


  // const handleSubscribe = () => {
  //   if (email && acceptTerms) {
  //     addNotification('Thank you for subscribing to our exclusive circle!', 'success', null, 'general');
  //     setEmail('');
  //     setAcceptTerms(false);
  //   } else {
  //     addNotification('Please enter your email and accept terms to continue.', 'error', null, 'general');
  //   }
  // };


  const handleSubscribe = async () => {
    // setAcceptTerms(true);
    if (!email) {
      addNotification("Please enter your email", "error", null, "general");
      return;
    }

    if (!validateEmail(email)) {
      addNotification("Please enter a valid email address", "error", null, "general");
      return;
    }

    if (!acceptTerms) {
      addNotification("Please accept terms & conditions", "error", null, "general");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      console.log("Response status:", res.status);

      const data = await res.json();

      if (data.success) {
        addNotification("Welcome to the Inner Circle!", "success", email, "general");
        setEmail("");
        setAcceptTerms(false);
      } else {
        addNotification(data.message, "error", null, "general");
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      addNotification("Something went wrong. Please try again.", "error", null, "general");
    }
  };



  // Enhanced product navigation handler with validation
  const handleProductClick = (product) => {
    if (!product) {
      console.error('❌ No product data provided for navigation');
      return;
    }

    if (!product._id) {
      console.error('❌ Product missing _id:', product);
      addNotification('Product not available', 'error', null, 'general');
      return;
    }

    const productId = product._id.toString();
    if (productId.length !== 24) {
      console.error('❌ Invalid product ID format:', productId);
      addNotification('Product not available', 'error', null, 'general');
      return;
    }

    console.log('🔗 Navigating to product:', {
      id: productId,
      name: product.name,
      category: product.category,
    });

    try {
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error('❌ Navigation error:', error);
      window.location.href = `/product/${productId}`;
    }
  };

  // UPDATED ProductCard Component with proper notification calls
  const ProductCard = memo(({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState({ primary: false, hover: false });
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    if (!product) return null;

    const currentPrice = Number(product.price) || 0;
    const comparePrice = Number(product.originalPrice || product.compareAtPrice || 0);
    const hasComparePrice = comparePrice > currentPrice;
    const ratingValue = typeof product.rating === 'number' ? product.rating.toFixed(1) : null;

    const productInCart = isInCart(product._id?.toString(), product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null);

    const handleAddToCart = async (e) => {
      e.stopPropagation();
      setIsAddingToCart(true);

      const cartItem = {
        id: product._id.toString(),
        name: product.name,
        price: Number(product.price),
        image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-gift.png',
        quantity: 1,
        selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null,
        personalization: null
      };

      try {
        const success = await addToCart(cartItem);
        if (success) {
          // UPDATED: Pass 'cart' as actionType with product name
          addNotification('Added to cart!', 'success', product.name, 'cart');
        } else {
          addNotification('Failed to add item to cart', 'error', null, 'cart');
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        addNotification('Something went wrong. Please try again.', 'error', null, 'cart');
      } finally {
        setIsAddingToCart(false);
      }
    };

    const handleWishlistToggle = (e) => {
      e.stopPropagation();
      if (!product._id) {
        addNotification('Unable to add to wishlist', 'error', null, 'wishlist');
        return;
      }

      try {
        const wasInWishlist = isInWishlist(product._id);

        const wishlistProduct = {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-gift.png',
          description: product.description || '',
          category: product.category || '',
          selectedSize: null
        };

        toggleWishlist(wishlistProduct);
        // UPDATED: Pass 'wishlist' as actionType with product name
        addNotification(
          wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
          'success',
          product.name,
          'wishlist'
        );
      } catch (error) {
        console.error('Wishlist toggle error:', error);
        addNotification('Failed to update wishlist', 'error', null, 'wishlist');
      }
    };

    const handleCardClick = () => {
      handleProductClick(product);
    };

    const getProductImage = () => {
      if (isHovered && product.hoverImage && !imageError.hover) {
        return product.hoverImage;
      }
      if (product.images && Array.isArray(product.images) && product.images.length > 0 && !imageError.primary) {
        return product.images[0];
      }
      return '/images/default-gift.png';
    };

    const handleImageError = (e, type = 'primary') => {
      setImageError(prev => ({ ...prev, [type]: true }));
      e.target.src = '/images/default-gift.png';
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.16)' }}
        transition={{ duration: 0.3 }}
        className="bg-white cursor-pointer transition-all duration-300 w-full max-w-[288px] h-[384px] p-5 rounded-lg shadow-[0px_1.12px_4.48px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="w-full flex justify-end mb-1">
          <motion.button
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="w-5 h-5 flex items-center justify-center"
            aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart
              size={14}
              className={`transition-all duration-200 ${isInWishlist(product._id) ? 'fill-red-600 text-red-600' : 'text-[#2A2420]'}`}
            />
          </motion.button>
        </div>

        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden min-h-0">
          <motion.img
            src={getProductImage()}
            alt={product.name || 'Product'}
            className="object-contain w-full h-full"
            onError={(e) => handleImageError(e, isHovered ? 'hover' : 'primary')}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            loading="lazy"
          />
        </div>

        <div className="w-full mt-2 flex flex-col gap-3.5">
          <div className="w-full flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="font-bold uppercase text-[20px] leading-6 tracking-wide truncate"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: uiTheme.ink
                }}
              >
                {product.name || 'Oud Wood'}
              </h3>
              <div className="mt-1.5 flex items-center gap-2.5">
                <span
                  className="text-[18px] font-bold"
                  style={{
                    color: '#4A220A',
                    fontFamily: 'Montserrat, Manrope, sans-serif'
                  }}
                >
                  ${currentPrice.toFixed(2)}
                </span>
                {hasComparePrice && (
                  <span
                    className="text-base line-through"
                    style={{
                      color: '#A9A29A',
                      fontFamily: 'Montserrat, Manrope, sans-serif'
                    }}
                  >
                    ${comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span
                className="text-[18px] font-semibold"
                style={{ color: '#8A5A22', fontFamily: 'Manrope, sans-serif' }}
              >
                {ratingValue || '4.2'}
              </span>
              <Star size={15} style={{ color: '#8A5A22', fill: '#8A5A22' }} />
            </div>
          </div>

          <motion.button
            onClick={productInCart ? (e) => {
              e.stopPropagation();
              setIsCartOpen(true);
            } : handleAddToCart}
            disabled={isAddingToCart}
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 px-3.5 bg-black rounded-md flex items-center justify-center gap-1.5 text-white uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Montserrat, Manrope, sans-serif',
              letterSpacing: '0.04em'
            }}
          >
            <ShoppingCart size={16} />
            <span className="text-base font-semibold">
              {isAddingToCart ? 'Adding...' : productInCart ? 'View Cart' : 'Add to Cart'}
            </span>
          </motion.button>
        </div>
      </motion.div>
    );
  });

  ProductCard.displayName = 'ProductCard';

  const CollectionSection = memo(({ title, products = [], sectionKey }) => {
    const isExpanded = expandedSections[sectionKey];
    const displayProducts = useMemo(() =>
      isExpanded ? products : products.slice(0, 4),
      [isExpanded, products]
    );
    const hasMoreProducts = products.length > 4;

    return isMobile ? (
      <ProductCardsMobile
        title={title}
        products={products}
        darkMode={darkMode}
        addNotification={addNotification}
      />
    ) : (
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6" style={{ backgroundColor: uiTheme.pageBg }}>
        <div className="max-w-[1555px] mx-auto">
          {/* Section Title - RESPONSIVE */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-bold mb-6 sm:mb-8 lg:mb-10 text-2xl sm:text-3xl lg:text-4xl"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: uiTheme.ink
            }}
          >
            {title}
          </motion.h3>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28 border-b-2 border-[#79300f]"></div>
            </div>
          ) : products && products.length > 0 ? (
            <>
              {/* Products Grid - RESPONSIVE */}
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 mb-7 sm:mb-10 justify-items-center"
              >
                <AnimatePresence mode="popLayout">
                  {displayProducts.map((product) => {
                    if (!product || !product._id) return null;
                    return (
                      <ProductCard key={product._id} product={product} />
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* View All Button - RESPONSIVE - EXACT STYLING MATCH */}
              {hasMoreProducts && (
                <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
                  <motion.button
                    onClick={() => toggleSection(sectionKey)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 transition-all duration-300  w-full max-w-[250px] h-[40px] sm:h-[48px] px-5 flex items-center justify-center"
                    style={{
                      borderColor: uiTheme.border,
                      backgroundColor: '#EEEBE4',
                      color: uiTheme.ink
                    }}
                  >
                    <span
                      className="text-sm sm:text-base font-bold uppercase"
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {isExpanded ? 'Show Less' : 'View all Fragrances'}
                    </span>
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                No products available in this collection.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Please check back later or try refreshing the page.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  });

  CollectionSection.displayName = 'CollectionSection';

  // Enhanced Dynamic Banner Component with click handling
  const DynamicBanner = ({ banner, type = 'hero' }) => {
    if (!banner) return null;

    const handleClick = () => {
      handleBannerClick(banner);
    };

    const getButtonAction = () => {
      if (banner.buttonLink) return banner.buttonLink;

      const title = banner.title?.toLowerCase() || '';
      const description = banner.description?.toLowerCase() || '';

      if (title.includes('trending') || description.includes('trending')) {
        return '/trending-collection';
      }
      if (
        title.includes('best seller') ||
        description.includes('best seller') ||
        title.includes('bestseller')
      ) {
        return '/best-sellers-collection';
      }

      return '#';
    };

    if (type === 'product_highlight') {
      return isMobile ? (
        <ProductHighlightMobile banner={banner} />
      ) : (
        <motion.section
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          className="py-16 px-6"
          style={{ backgroundColor: uiTheme.pageBg }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="relative h-[560px] rounded-2xl overflow-hidden">
              <img
                src={banner.image || '/images/newimg1.PNG'}
                alt={banner.altText || banner.title}
                className="w-full h-full object-cover shadow-lg"
                onError={(e) => {
                  console.warn('Banner image failed to load:', e.target.src);
                  e.target.src = '/images/newimg1.PNG';
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute left-7 bottom-7 text-white">
                <h3 className="text-[52px] leading-[1.1] font-[Playfair_Display] max-w-[420px]">
                  {banner.title || 'Soleil Blanc Oud Immortel'}
                </h3>
                <button className="mt-5 px-6 py-2 bg-white/90 text-black text-xs uppercase tracking-wider rounded">
                  Shop Now
                </button>
              </div>
            </div>

            <div className="text-left">
              <h2 className="text-5xl font-[Playfair_Display] mb-4" style={{ color: uiTheme.ink }}>
                {banner.subtitle || 'Trending'}
              </h2>
              <p className="text-lg leading-8" style={{ color: uiTheme.muted }}>
                {banner.description || 'Our most sought-after fragrances chosen by customers and loved for their character.'}
              </p>
              <button
                onClick={handleClick}
                className="mt-8 bg-[#171412] text-white px-10 py-3 uppercase tracking-wider"
              >
                {banner.buttonText || 'Explore'}
              </button>
            </div>
          </div>
        </motion.section>
      );
    }

    if (type === 'collection_highlight') {
      return isMobile ? (
        <CollectionHighlightMobile banner={banner} />
      ) : (
        <motion.section
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          className="py-16 px-6"
          style={{ backgroundColor: uiTheme.pageBg }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[620px]">
              <img
                src={banner.image || '/images/newimg1.PNG'}
                alt={banner.altText || banner.title}
                className="w-full h-full object-cover shadow-lg"
                onError={(e) => {
                  console.warn('Banner image failed to load:', e.target.src);
                  e.target.src = '/images/newimg1.PNG';
                }}
              />
              <div className="absolute -bottom-14 right-[-22px] bg-white border shadow-lg p-8 w-[250px]" style={{ borderColor: uiTheme.border }}>
                <p className="text-[#8D6A14] text-3xl leading-none">&quot;</p>
                <p className="mt-2 text-[#3E3934] text-[30px] leading-[1.3] font-[Noto_Serif]">
                  &quot;Fragrance is the most intense form of memory.&quot;
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.16em] text-[#625D57]">Jean Paul G.</p>
              </div>
            </div>

            <div className="text-left">
              <p className="uppercase tracking-[0.14em] text-sm mb-3 text-[#8D6A14]">{banner.subtitle || 'The Experience'}</p>
              <h2 className="text-[58px] leading-[1.08] font-[Playfair_Display] mb-5" style={{ color: uiTheme.ink }}>
                {banner.title || 'A Scented Narrative for the Soul'}
              </h2>
              <p className="text-[18px] leading-8 mb-6" style={{ color: uiTheme.muted }}>
                {banner.description || 'Each bottle is a chapter of a larger story. Visit our atelier to find your signature.'}
              </p>
              <button
                onClick={handleClick}
                className="pb-2 border-b uppercase tracking-[0.12em] text-sm"
                style={{ color: '#8D6A14', borderColor: 'rgba(141,106,20,0.25)' }}
              >
                Discover our story
              </button>
            </div>
          </div>
        </motion.section>
      );
    }

    return null;
  };

  // Specific handler for Scent carousel navigation
  const handleScentClick = (product) => {
    if (!product || !product._id) return;
    const productId = product._id.toString();
    console.log('🔗 Navigating to scent:', productId);
    navigate(`/scent/${productId}`);
  };

  // Best Seller Carousel Section
  const BestSellerCarousel = memo(({ products = [] }) => {
    const items = useMemo(
      () => (Array.isArray(products) ? products : []).filter((p) => p && p._id).slice(0, 7),
      [products]
    );

    if (!items.length) return null;

    return (
      <section className="relative w-full py-10 sm:py-12 px-4 sm:px-6" style={{ backgroundColor: uiTheme.pageBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-5 sm:mb-6 text-center">
            <h2 className="font-[Playfair_Display] font-semibold text-3xl sm:text-4xl md:text-[44px]" style={{ color: uiTheme.ink }}>
              Our Collection
            </h2>
          </div>

          <PerfumeSlideAnimation products={items} onProductClick={handleScentClick} />
        </div>
      </section>
    );
  });

  BestSellerCarousel.displayName = 'BestSellerCarousel';

  // Quick View Modal
  const QuickViewModal = () => {
    if (!quickViewProduct) {
      return null;
    }

    const handleClose = () => {
      setQuickViewProduct(null);
    };

    const handleQuickViewWishlist = () => {
      if (quickViewProduct._id) {
        try {
          const wishlistProduct = {
            id: quickViewProduct._id.toString(),
            name: quickViewProduct.name,
            price: quickViewProduct.price,
            image:
              quickViewProduct.images && quickViewProduct.images.length > 0
                ? quickViewProduct.images[0]
                : '/images/default-gift.png',
            description: quickViewProduct.description || '',
            category: quickViewProduct.category || '',
            selectedSize: null,
          };

          const wasInWishlist = isInWishlist(quickViewProduct._id);
          toggleWishlist(wishlistProduct);
          // UPDATED: Pass 'wishlist' as actionType with product name
          addNotification(
            wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
            'success',
            quickViewProduct.name,
            'wishlist'
          );
        } catch (error) {
          console.error('Wishlist toggle error:', error);
          addNotification('Failed to update wishlist', 'error', null, 'wishlist');
        }
      } else {
        addNotification('Unable to update wishlist', 'error', null, 'wishlist');
      }
    };

    const handleQuickViewAddToCart = async () => {
      if (!quickViewProduct._id) {
        addNotification('Product not available', 'error', null, 'cart');
        return;
      }

      const cartItem = {
        id: quickViewProduct._id.toString(),
        name: quickViewProduct.name,
        price: Number(quickViewProduct.price),
        image:
          quickViewProduct.images && quickViewProduct.images.length > 0
            ? quickViewProduct.images[0]
            : '/images/default-gift.png',
        quantity: 1,
        selectedSize:
          quickViewProduct.sizes && quickViewProduct.sizes.length > 0
            ? quickViewProduct.sizes[0].size
            : null,
        personalization: null,
      };

      try {
        const success = await addToCart(cartItem);
        if (success) {
          // UPDATED: Pass 'cart' as actionType with product name
          addNotification('Added to cart!', 'success', quickViewProduct.name, 'cart');
          handleClose();
        } else {
          addNotification('Failed to add item to cart', 'error', null, 'cart');
        }
      } catch (error) {
        console.error('❌ Quick View Add to cart error:', error);
        addNotification('Something went wrong. Please try again.', 'error', null, 'cart');
      }
    };

    const productInQuickViewCart = isInCart(
      quickViewProduct._id?.toString(),
      quickViewProduct.sizes && quickViewProduct.sizes.length > 0
        ? quickViewProduct.sizes[0].size
        : null
    );

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white  p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#79300f]">Quick View</h3>

              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close quick view"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={quickViewProduct.images?.[0] || '/images/default-gift.png'}
                  alt={quickViewProduct.name || 'Product'}
                  className="w-full h-64 object-contain  bg-gray-100"
                  onError={(e) => {
                    e.target.src = '/images/default-gift.png';
                  }}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">
                  {quickViewProduct.name || 'Unnamed Product'}
                </h4>
                <p className="text-gray-600">
                  {quickViewProduct.description || 'No description available'}
                </p>
                <p className="text-2xl font-bold text-[#79300f]">
                  ${quickViewProduct.price ? quickViewProduct.price.toFixed(2) : '0.00'}
                </p>

                <div className="flex gap-4">
                  {productInQuickViewCart ? (
                    <button
                      onClick={() => {
                        setIsCartOpen(true);
                        handleClose();
                      }}
                      className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white py-3  font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 border border-emerald-400/30 shadow-emerald-500/20"
                    >
                      <ShoppingCart size={20} />
                      <span>View in Cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleQuickViewAddToCart}
                      className="flex-1 bg-gradient-to-r from-[#79300f] to-[#5a2408] text-white py-3  font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag size={20} />
                      <span>Add to Cart</span>
                    </button>
                  )}
                  <button
                    onClick={handleQuickViewWishlist}
                    className="px-4 py-3 border-2 border-[#79300f] text-[#79300f] hover:bg-[#79300f] hover:text-white transition-all duration-300"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={20}
                      className={
                        isInWishlist(quickViewProduct._id) ? 'fill-red-600 text-red-600' : ''
                      }
                    />
                  </button>
                  <button
                    onClick={() => {
                      if (quickViewProduct._id) {
                        navigate(`/product/${quickViewProduct._id}`);
                        handleClose();
                      } else {
                        addNotification('Product details not available', 'error', null, 'general');
                      }
                    }}
                    className="px-4 py-3 border-2 border-gray-300 text-gray-600  hover:bg-gray-300 hover:text-gray-800 transition-all duration-300"
                    aria-label="View full details"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // UPDATED: Custom Notification System (exact match with MensCollection)
  const NotificationSystem = () => (
    <div className="fixed z-[9999] space-y-3" style={{ top: '40px', right: '20px' }}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 400, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'relative',
              width: '400px',
              height: '100px',
              backgroundColor: '#EDE4CF',
              overflow: 'hidden',
              boxShadow: '4px 6px 16px 0px rgba(0,0,0,0.1), 18px 24px 30px 0px rgba(0,0,0,0.09), 40px 53px 40px 0px rgba(0,0,0,0.05), 71px 95px 47px 0px rgba(0,0,0,0.01), 110px 149px 52px 0px rgba(0,0,0,0)',
              borderRadius: '4px'
            }}
          >
            {/* Left Vertical Bar */}
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '0',
                width: '12px',
                height: '100%',
                backgroundColor: '#AC9157'
              }}
            />
            {/* Icon - Show correct icon based on actionType */}
            <div
              style={{
                position: 'absolute',
                top: '30px',
                left: '36px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {notification.type === 'error' ? (
                <AlertCircle size={40} style={{ color: '#AC9157' }} strokeWidth={1.5} />
              ) : notification.actionType === 'wishlist' ? (
                <Heart size={40} style={{ color: '#AC9157' }} strokeWidth={1.5} />
              ) : notification.actionType === 'cart' ? (
                <ShoppingCart size={40} style={{ color: '#AC9157' }} strokeWidth={1.5} />
              ) : (
                <CheckCircle size={40} style={{ color: '#AC9157' }} strokeWidth={1.5} />
              )}
            </div>
            {/* Close Icon */}
            <button
              onClick={() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              aria-label="Close notification"
            >
              <X size={24} style={{ color: '#242122' }} strokeWidth={2} />
            </button>
            {/* Title Text - Show correct title based on actionType */}
            <div
              style={{
                position: 'absolute',
                top: '22px',
                left: '96px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#242122',
                whiteSpace: 'nowrap'
              }}
            >
              {notification.type === 'error'
                ? 'Error'
                : notification.actionType === 'wishlist'
                  ? (notification.message.includes('Removed') ? 'Removed from Wishlist' : 'Added to Wishlist')
                  : notification.actionType === 'cart'
                    ? 'Added to Cart'
                    : 'Success'
              }
            </div>
            {/* Product Name or Message */}
            <div
              style={{
                position: 'absolute',
                top: '56px',
                left: '96px',
                width: '271px',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '22px',
                color: '#5B5C5B',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {notification.productName || notification.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: uiTheme.pageBg }}>
      <Header />
      <NotificationSystem />
      <QuickViewModal />

      {/* CART SIDEBAR - ADD THIS */}
      <ProductCartSection isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="flex-1" style={{ backgroundColor: uiTheme.pageBg }}>
        {/* HeroSection */}
        {isMobile ? (
          <HeroSectionMobile />
        ) : (
          <HeroSection
            title="Unveil Your Signature Scent"
            subtitle="A fragrance that transcends time, inspired by rare woods and eternal elegance."
            image={banners.hero?.image || '/images/hero-default.png'}
            buttonText="Discover Collection"
            onButtonClick={() => navigate('/discover-collection')}
          />
        )}


        {/* Best Sellers Carousel */}
        {/* {collections.best_seller_scents && collections.best_seller_scents.length > 0 && (
          <BestSellerCarousel products={collections.best_seller_scents} />
        )} */}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-4 text-red-600"
          >
            <AlertCircle size={20} className="inline mr-2" />
            {error}
          </motion.div>
        )}

        <CollectionSection
          title="Fragrant Favourites"
          products={collections.fragrant_favourites}
          index={currentIndex}
          navigation={fragrantFavouritesNav}
          scrollRef={scrollRef}
          sectionKey="fragrant_favourites"
        />

        {/* Dynamic Product Highlight Banners */}
        {banners.product_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="product_highlight" />
        ))}

        <CollectionSection
          title="Summer Scents"
          products={collections.summer_scents}
          index={summerCurrentIndex}
          navigation={summerScentsNav}
          scrollRef={summerScrollRef}
          sectionKey="summer_scents"
        />

        {/* Dynamic Collection Highlight Banners */}
        {banners.collection_highlight.map((banner, index) => (
          <DynamicBanner key={banner._id || index} banner={banner} type="collection_highlight" />
        ))}

        <CollectionSection
          title="Signature Collection"
          products={collections.signature_collection}
          index={signatureCurrentIndex}
          navigation={signatureCollectionNav}
          scrollRef={signatureScrollRef}
          sectionKey="signature_collection"
        />

        <section className="hidden md:block py-20 px-6" style={{ backgroundColor: '#E8E6E1' }}>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[50px] md:text-[56px] font-[Playfair_Display] mb-4 text-[#2A2420] leading-tight">
                The Vesarii Inner Circle
              </h2>
              <p className="text-[20px] mb-10 text-[#59544E] leading-relaxed max-w-2xl mx-auto">
                Private access to rare editions, secret previews, and Parisian inspirations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-6 py-4 flex-1 outline-none border border-[#CFC9C0] focus:border-[#B4AEA5] transition-all duration-300 bg-[#F4F2ED] text-[#2A2420] placeholder:text-[#6B655F]"
                />
                <Button
                  onClick={handleSubscribe}
                  className="bg-[#2D312D] px-8 py-2 font-bold text-sm transition-colors tracking-wider whitespace-nowrap font-[Manrope] !text-[#F2F2EF]"
                >
                  JOIN THE CIRCLE
                </Button>
              </div>

              {/* ✅ ADD THIS BLOCK (THIS WAS MISSING) */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#CDAF6E]"
                />

                <label
                  htmlFor="acceptTerms"
                  className="text-sm text-[#59544E] cursor-pointer select-none"
                >
                  I agree to the Terms & Conditions
                </label>
              </div>

              <p className="text-[14px] text-[#6B655F]">
                By joining, you'll receive updates on limited editions and private events.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;