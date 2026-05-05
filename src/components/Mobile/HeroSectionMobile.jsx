
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSectionMobile = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    setSearchValue('');
  };

  const handleShopNow = () => {
    navigate("/discover-collection");
  };

  return (
    <section className="w-full bg-[#ECECEC] px-4 pt-8 pb-6">
      <form onSubmit={handleSearchSubmit} className="w-full h-14 flex items-center gap-2 mb-3.5">
        <div className="flex-1 h-full px-3.5 rounded-md outline outline-[0.44px] outline-offset-[-0.44px] outline-stone-900 flex items-center gap-3 bg-white">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent outline-none text-stone-900 text-lg font-normal tracking-wide"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        <button type="submit" className="h-full px-3.5 bg-[#D4AF37] rounded-md flex items-center justify-center" aria-label="Search">
          <FiSearchIcon />
        </button>
      </form>

      <div className="w-full flex flex-col justify-start items-start gap-8">
        <div className="w-full flex flex-col justify-start items-start gap-4">
          <img className="w-full h-[326px] object-cover" src="/images/hero-default.png" alt="Unveil Your Signature Scent" />
          <h1 className="w-[288px] text-stone-900 text-[50px] font-normal leading-[58.56px]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Unveil Your Signature Scent
          </h1>
          <p className="w-full text-stone-900 text-2xl font-normal leading-9" style={{ fontFamily: 'Inter, sans-serif' }}>
            A fragrance that transcends time, inspired by rare woods and eternal elegance.
          </p>
        </div>

        <button
          onClick={handleShopNow}
          className="w-full h-14 p-3.5 bg-[#D4AF37] rounded-md inline-flex justify-center items-center"
        >
          <span className="text-stone-900 text-xl font-medium uppercase leading-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Shop Now
          </span>
        </button>
      </div>
    </section>
  );
};

const FiSearchIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.65" y1="16.65" x2="21" y2="21" />
  </svg>
);

export default HeroSectionMobile;

