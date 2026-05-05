
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';

const ProductCardsMobile = ({ title, products = [], darkMode, addNotification }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? products : products.slice(0, 4);

  const isFragrantFavorites = String(title || '').toLowerCase().includes('fragrant');

  const CompactCard = memo(({ product }) => {
    if (!product?._id) return null;

    const productInCart = isInCart(product._id?.toString(), product.sizes?.[0]?.size || null);
    const ratingValue = typeof product.rating === 'number' ? product.rating.toFixed(1) : '4.2';

    const handleAddToCart = async (e) => {
      e.stopPropagation();

      const cartItem = {
        id: product._id.toString(),
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || '/images/default-gift.png',
        quantity: 1,
        selectedSize: product.sizes?.[0]?.size || null,
        personalization: null,
      };

      try {
        const success = await addToCart(cartItem);
        if (success) {
          addNotification?.('Added to cart!', 'success', product.name, 'cart');
        }
      } catch (error) {
        addNotification?.('Something went wrong. Please try again.', 'error', null, 'cart');
      }
    };

    const handleWishlistToggle = (e) => {
      e.stopPropagation();
      const wishlistProduct = {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/images/default-gift.png',
        description: product.description || '',
        category: product.category || '',
        selectedSize: null,
      };
      toggleWishlist(wishlistProduct);
    };

    return (
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="w-[138px] h-48 p-2.5 bg-white rounded shadow-[0px_0.58px_2.3px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-end gap-[0.86px] shrink-0"
      >
        <button onClick={handleWishlistToggle} className="w-2.5 h-2.5" aria-label="Toggle wishlist">
          <FiHeart size={10} className={isInWishlist(product._id) ? 'fill-stone-900 text-stone-900' : 'text-stone-900'} />
        </button>

        <img className="w-32 h-24 object-contain" src={product.images?.[0] || '/images/default-gift.png'} alt={product.name} />

        <div className="self-stretch flex flex-col justify-start items-center gap-2">
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="w-24 inline-flex flex-col justify-start items-start gap-[3px]">
              <div className="self-stretch text-stone-900 text-[8px] font-bold uppercase tracking-wide truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name || 'Oud Wood'}
              </div>
              <div className="text-orange-950 text-[8px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                ${Number(product.price || 0).toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-[2px]">
              <span className="text-[#9a5b37] text-[7px] font-semibold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {ratingValue}
              </span>
              <Star size={8} className="fill-[#9a5b37] text-[#9a5b37]" />
            </div>
          </div>

          <button
            onClick={productInCart ? (e) => e.stopPropagation() : handleAddToCart}
            className="self-stretch h-6 p-1.5 bg-black rounded-[3px] flex items-center justify-center gap-[3px]"
          >
            <ShoppingCart size={10} className="text-white" />
            <span className="text-white text-[7px] font-semibold uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Add to cart
            </span>
          </button>
        </div>
      </div>
    );
  });

  const ProductCard = memo(({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    if (!product) return null;

    const productInCart = isInCart(
      product._id?.toString(),
      product.sizes?.[0]?.size || null
    );

    const handleAddToCart = async (e) => {
      e.stopPropagation();
      setIsAddingToCart(true);

      const cartItem = {
        id: product._id.toString(),
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || '/images/default-gift.png',
        quantity: 1,
        selectedSize: product.sizes?.[0]?.size || null,
        personalization: null,
      };

      try {
        const success = await addToCart(cartItem);
        if (success) {
          addNotification?.('Added to cart!', 'success', product.name, 'cart');
        } else {
          addNotification?.('Failed to add item to cart', 'error', null, 'cart');
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        addNotification?.('Something went wrong. Please try again.', 'error', null, 'cart');
      } finally {
        setIsAddingToCart(false);
      }
    };

    const handleWishlistToggle = (e) => {
      e.stopPropagation();
      if (!product._id) {
        addNotification?.('Unable to add to wishlist', 'error', null, 'wishlist');
        return;
      }

      try {
        const wasInWishlist = isInWishlist(product._id);

        const wishlistProduct = {
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '/images/default-gift.png',
          description: product.description || '',
          category: product.category || '',
          selectedSize: null,
        };

        toggleWishlist(wishlistProduct);
        addNotification?.(
          wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!',
          'success',
          product.name,
          'wishlist'
        );
      } catch (error) {
        console.error('Wishlist toggle error:', error);
        addNotification?.('Failed to update wishlist', 'error', null, 'wishlist');
      }
    };

    return (
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-md overflow-hidden w-full flex flex-col"
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center justify-center aspect-[1/1] p-3">
          <motion.img
            src={product.images?.[0] || '/images/default-gift.png'}
            alt={product.name}
            className="object-contain w-full h-full max-w-[160px]"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.4 }}
          />

          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 bg-white p-1.5"
            aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart
              size={14}
              className={
                isInWishlist(product._id)
                  ? 'fill-red-600 text-red-600'
                  : 'text-[#5A2408]'
              }
            />
          </button>
        </div>

        <div className="px-3 py-3 flex flex-col gap-2 flex-grow">
          <h3
            className="font-bold uppercase text-center text-sm"
            style={{ fontFamily: 'Playfair Display, serif', color: '#5A2408' }}
          >
            {product.name}
          </h3>

          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                style={{
                  color: '#5A2408',
                  fill: i < Math.floor(product.rating || 0) ? '#5A2408' : 'transparent',
                }}
              />
            ))}
          </div>

          <p
            className="text-center text-xs line-clamp-2"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#7E513A' }}
          >
            {product.description || 'Premium fragrance'}
          </p>

          <p
            className="font-bold text-center text-sm"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#431A06' }}
          >
            ${product.price?.toFixed(2)}
          </p>

          <button
            onClick={productInCart ? () => navigate('/cart') : handleAddToCart}
            disabled={isAddingToCart}
            className="flex items-center justify-center gap-2 text-white font-bold uppercase h-[42px] w-full text-xs mt-auto"
            style={{ backgroundColor: '#431A06' }}
          >
            <ShoppingCart size={16} />
            {isAddingToCart ? 'Adding...' : productInCart ? 'View Cart' : 'Add to Cart'}
          </button>
        </div>
      </motion.div>
    );
  });

  ProductCard.displayName = 'ProductCard';

  CompactCard.displayName = 'CompactCard';

  if (isFragrantFavorites) {
    const featuredProduct = products[0] || {};
    const product2 = products[1] || {};
    const product3 = products[2] || {};

    return (
      <section className="w-full h-auto p-4 inline-flex flex-col justify-start items-center gap-7 bg-[#ECECEC]">
        <div className="w-full max-w-[672px] flex flex-col justify-start items-start gap-px">
          <div className="self-stretch flex flex-col justify-start items-center">
            <div className="w-full text-center text-zinc-800 text-2xl font-semibold leading-9" style={{ fontFamily: 'Playfair Display, serif' }}>
              Fragrant Favorites
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-center">
            <div className="self-stretch text-center text-zinc-600 text-base font-normal leading-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Exploring the boundary between nature and chemistry.
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-center gap-3">
          <div className="w-full flex flex-col justify-start items-start gap-4">
            <div onClick={() => featuredProduct._id && navigate(`/product/${featuredProduct._id}`)} className="self-stretch h-44 px-7 pt-6 pb-7 relative bg-white flex flex-col justify-center items-start overflow-hidden cursor-pointer">
              <img className="w-60 h-60 left-[150px] top-[-38px] absolute object-contain" src={featuredProduct.images?.[0] || '/images/default-gift.png'} alt={featuredProduct.name || 'Vétiver Extrême'} />
              <div className="self-stretch flex flex-col justify-between items-start z-10">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="px-1.5 py-0.5 bg-orange-200 rounded-md inline-flex justify-start items-start">
                    <div className="text-yellow-900 text-[6px] font-normal uppercase leading-[8px] tracking-wide" style={{ fontFamily: 'Manrope, sans-serif' }}>New Release</div>
                  </div>
                  <div className="self-stretch text-zinc-800 text-xl font-normal leading-5" style={{ fontFamily: 'Noto Serif, serif' }}>
                    {featuredProduct.name || 'Vétiver Extrême'}
                  </div>
                </div>
                <div className="w-52 flex flex-col justify-start items-start gap-3.5 mt-2">
                  <div className="w-52 text-zinc-800 text-[10px] font-normal leading-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {featuredProduct.description || 'The ultimate expression of earth and roots.'}
                  </div>
                  <div className="px-4 py-2 bg-zinc-800 rounded inline-flex justify-center items-center">
                    <div className="text-stone-50 text-[7px] font-normal uppercase leading-[9px] tracking-wide" style={{ fontFamily: 'Manrope, sans-serif' }}>Shop Now</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="self-stretch inline-flex justify-center items-center gap-3">
              <div onClick={() => product2._id && navigate(`/product/${product2._id}`)} className="flex-1 self-stretch p-4 bg-stone-50 outline outline-[0.55px] outline-offset-[-0.55px] outline-neutral-400/10 inline-flex flex-col justify-start items-start cursor-pointer">
                <div className="self-stretch h-28 flex flex-col justify-center items-start">
                  <img className="self-stretch flex-1 object-contain mix-blend-multiply" src={product2.images?.[0] || '/images/default-gift.png'} alt={product2.name || 'Discovery Set'} />
                </div>
                <div className="self-stretch text-zinc-800 text-xs font-normal leading-4" style={{ fontFamily: 'Noto Serif, serif' }}>
                  {product2.name || 'Discovery Set'}
                </div>
                <div className="self-stretch pt-1 text-yellow-800 text-[9px] font-bold leading-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  ${Number(product2.price || 65).toFixed(2)}
                </div>
              </div>

              <div onClick={() => product3._id && navigate(`/product/${product3._id}`)} className="flex-1 self-stretch p-4 bg-stone-50 outline outline-[0.56px] outline-offset-[-0.56px] outline-neutral-400/10 inline-flex flex-col justify-start items-start cursor-pointer">
                <div className="self-stretch h-28 flex flex-col justify-center items-start">
                  <img className="self-stretch h-28 object-contain mix-blend-multiply" src={product3.images?.[0] || '/images/default-gift.png'} alt={product3.name || 'Bois de Luxe'} />
                </div>
                <div className="self-stretch text-zinc-800 text-xs font-normal leading-4" style={{ fontFamily: 'Noto Serif, serif' }}>
                  {product3.name || 'Bois de Luxe'}
                </div>
                <div className="self-stretch pt-1 text-yellow-800 text-[9px] font-bold leading-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  ${Number(product3.price || 75).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/gift-collection')} className="w-full h-20 relative bg-amber-100/60 cursor-pointer">
            <div className="left-[21px] top-[11px] absolute inline-flex flex-col justify-start items-start gap-1.5">
              <div className="w-32 text-zinc-800 text-base font-normal leading-5" style={{ fontFamily: 'Noto Serif, serif' }}>The Gift Curation</div>
              <div className="w-52 text-zinc-800 text-[9px] font-normal leading-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Elegantly wrapped in silk and paper.</div>
              <div className="pt-[0.33px] pb-[2.98px] border-b-[0.66px] border-yellow-800/20 inline-flex justify-start items-start">
                <div className="w-16 text-yellow-800 text-[8px] font-normal uppercase leading-3 tracking-wide" style={{ fontFamily: 'Manrope, sans-serif' }}>Shop Gifting</div>
              </div>
            </div>
            <div className="w-9 h-11 left-[283px] top-[24px] absolute opacity-40 inline-flex flex-col justify-start items-start">
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="8" width="22" height="6" stroke="#854D0E" strokeWidth="1.2" />
                <path d="M12 8V27" stroke="#854D0E" strokeWidth="1.2" />
                <path d="M2 14V26H22V14" stroke="#854D0E" strokeWidth="1.2" />
                <path d="M8 8C8 6 9.2 4 12 4C14.8 4 16 6 16 8" stroke="#854D0E" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full p-4 bg-[#ECECEC] inline-flex flex-col justify-start items-end gap-4">
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="w-full text-center text-stone-900 text-2xl font-semibold leading-9" style={{ fontFamily: 'Playfair Display, serif' }}>
          {title || 'Our Collection'}
        </div>
        <div className="self-stretch inline-flex justify-start items-center gap-2 overflow-x-auto scrollbar-hide">
        {visibleProducts.map((product) => (
            <CompactCard key={product._id} product={product} />
        ))}
        </div>
      </div>

      {products.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-32 h-8 p-2 rounded-sm outline outline-[0.54px] outline-offset-[-0.54px] outline-zinc-800 inline-flex justify-center items-center"
        >
          <span className="text-black text-sm font-medium uppercase leading-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {showAll ? 'View Less' : 'View More'}
          </span>
        </button>
      )}
    </section>
  );
};

export default ProductCardsMobile;
