

import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from '../../variants';
import { useNavigate } from "react-router-dom";

const ProductHighlightMobile = ({ banner }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (banner?.link) {
      navigate(banner.link);
    }
  };

  return (
    <motion.section
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="px-4 py-8 bg-[#ECECEC]"
    >
      <div className="w-full flex flex-col justify-start items-start gap-8">
        <div className="w-full rounded-2xl overflow-hidden relative">
          <img
            className="w-full h-[364px] object-cover"
            src={banner?.image || '/images/newimg1.PNG'}
            alt={banner?.altText || banner?.title || 'Trending'}
            onError={(e) => {
              e.target.src = '/images/newimg1.PNG';
            }}
          />

          <div className="absolute left-7 top-10 text-white text-xl font-semibold leading-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            {banner?.title || 'Soleil Blanc Oud Immortel'}
          </div>

          <button
            onClick={handleClick}
            className="absolute right-7 bottom-7 w-36 h-12 p-2 bg-white rounded-[1px] inline-flex justify-center items-center"
          >
            <span className="text-black text-sm font-medium uppercase leading-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Shop Now
            </span>
          </button>
        </div>

        <div className="w-full flex flex-col justify-start items-end gap-8">
          <div className="w-full flex flex-col justify-start items-start gap-3">
            <h3 className="w-full text-stone-900 text-2xl font-semibold leading-9" style={{ fontFamily: 'Playfair Display, serif' }}>
              {banner?.subtitle || 'Trending'}
            </h3>
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <p className="w-full opacity-80 text-neutral-600 text-base font-normal tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {banner?.description || 'Our most sought-after fragrances chosen by our customers and selected for their character.'}
              </p>
              <p className="w-full opacity-80 text-neutral-600 text-base font-normal tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Our most sought-after fragrances selected by you.
              </p>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="w-40 h-14 p-3.5 bg-stone-950 rounded inline-flex justify-center items-center"
          >
            <span className="text-white text-sm font-medium uppercase leading-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {banner?.buttonText || 'Explore'}
            </span>
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductHighlightMobile;
