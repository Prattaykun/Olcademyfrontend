import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CollectionHighlight = ({ banner }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (banner?.link) navigate(banner.link);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-[#ECECEC] py-12 px-4"
    >
      <div className="w-full flex flex-col justify-start items-start gap-20">
        <div className="w-full relative flex flex-col justify-end items-end">
          <img
            src={banner?.image || '/images/newimg1.PNG'}
            alt={banner?.altText || banner?.title}
            className="w-full h-[301px] object-cover"
            onError={(e) => {
              e.target.src = '/images/newimg1.PNG';
            }}
          />

          <div className="w-40 h-44 p-4 absolute right-0 bottom-[-34px] bg-white shadow-[0px_1.93px_3.38px_0px_rgba(0,0,0,0.14)] flex flex-col justify-start items-start gap-5">
            <div className="w-3.5 h-2.5 bg-yellow-800" />
            <div className="self-stretch flex-1 text-zinc-800 text-xs font-normal leading-5" style={{ fontFamily: 'Noto Serif, serif' }}>
              "Fragrance is the most intense form of memory."
            </div>
            <div className="self-stretch text-zinc-800 text-[8px] font-normal uppercase tracking-wide" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Jean Paul G.
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-3">
          <p className="w-full text-yellow-800 text-[10px] font-normal uppercase leading-3 tracking-wide" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {banner?.subtitle || 'The Experience'}
          </p>
          <h2 className="w-full text-zinc-800 text-4xl font-normal leading-10" style={{ fontFamily: 'Playfair Display, serif' }}>
            {banner?.title || 'A Scented Narrative for the Soul'}
          </h2>
          <p className="w-full pt-2.5 pb-4 text-zinc-600 text-xs font-normal leading-5" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {banner?.description || 'Each bottle is a chapter of a larger story. We believe your scent should be as unique as your own history. Visit our atelier to find your signature.'}
          </p>

          <button onClick={handleClick} className="pb-1.5 border-b border-yellow-800/20 inline-flex justify-start items-center gap-1.5">
            <span className="text-yellow-800 text-[10px] font-normal uppercase leading-3 tracking-wide" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {banner?.buttonText || 'Discover Our Story'}
            </span>
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#854D0E" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default CollectionHighlight;
