import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({
  title = 'Unveil Your Signature Scent',
  subtitle = 'A fragrance that transcends time, inspired by rare woods and eternal elegance.',
  image = '/images/hero-default.png',
  buttonText = 'Discover Collection',
  onButtonClick,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [heroImage, setHeroImage] = useState(image || '/images/hero-default.png');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const navigate = useNavigate();

  const heroFallbacks = [image, '/images/hero-default.png', '/images/baner1.jpeg'].filter(Boolean);

  React.useEffect(() => {
    setFallbackIndex(0);
    setHeroImage(heroFallbacks[0] || '/images/hero-default.png');
  }, [image]);

  const handleHeroImageError = () => {
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < heroFallbacks.length) {
      setFallbackIndex(nextIndex);
      setHeroImage(heroFallbacks[nextIndex]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    setSearchValue('');
  };

  const handleShopNow = () => {
    if (typeof onButtonClick === 'function') {
      onButtonClick();
      return;
    }
    navigate('/discover-collection');
  };

  return (
    <section className="w-full bg-[#F1F0ED]">
      <div className="w-full max-w-[1512px] mx-auto grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-[772px]">
        <div className="px-6 sm:px-10 lg:px-16 pt-16 lg:pt-28 pb-12 flex flex-col">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center w-full max-w-[872px]">
            <div className="flex-1 h-14 px-4 rounded-md border border-[#5A514A] bg-[#F4F3F0] flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D3732" strokeWidth="2">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
              </svg>
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search Perfume, Fragrance"
                className="w-full bg-transparent outline-none text-[#2A2420] text-base"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 rounded-md bg-[#D4AF37] text-[#2A2420] text-lg font-medium uppercase tracking-wide"
            >
              Search
            </button>
          </form>

          <div className="mt-10 max-w-[740px]">
            <h1 className="text-[48px] sm:text-[58px] lg:text-[64px] leading-[1.12] font-[Playfair_Display] text-[#2A2420]">
              {title}
            </h1>
            <p className="mt-5 text-[22px] sm:text-[24px] leading-[1.45] text-[#3E3832] font-[Inter]">
              {subtitle}
            </p>
            <button
              onClick={handleShopNow}
              className="mt-8 h-14 px-10 rounded-md bg-[#D4AF37] text-[#2A2420] text-lg font-medium uppercase tracking-wide"
            >
              {buttonText}
            </button>
          </div>
        </div>

        <div className="h-[420px] lg:h-auto">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover"
            onError={handleHeroImageError}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
