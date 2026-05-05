import React, { useEffect, useState } from 'react';
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (isMobile) {
    return (
      <footer className="bg-[#E8E6E1] px-6 py-10 font-[Manrope] text-sm leading-[160%] tracking-wider md:hidden">
        <div className="w-full max-w-xs mx-auto flex flex-col items-start gap-8">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="text-center text-black text-2xl font-bold font-['Playfair']">The Vesarii Inner Circle</div>
            <div className="text-center text-zinc-600 text-sm font-normal font-['Manrope']">Private access to rare editions, secret previews, and Parisian inspirations.</div>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <input aria-label="email" className="w-full h-12 bg-zinc-100 border border-stone-300 px-3" placeholder="EMAIL" />
            <button className="w-44 h-12 bg-zinc-800 text-white text-sm font-bold uppercase tracking-wide">Join the Circle</button>
            <div className="text-neutral-500 text-sm text-center">By joining, you'll receive updates on limited editions and private events.</div>
          </div>

          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-20 h-20 flex items-center justify-center">
              <img src="/images/Logo.png" alt="Vesarii logo" className="w-20 h-auto object-contain" />
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-zinc-800 text-lg font-semibold">Address:</div>
              <div className="text-zinc-800 text-base">Vesarii Fragrance House, Paris, France</div>

              <div className="mt-3 text-center">
                <div className="text-zinc-800 text-lg font-semibold">Contact:</div>
                <div className="text-zinc-800 text-base underline">+33 1 23 45 67</div>
                <div className="text-zinc-800 text-base underline">contact@vesarii.com</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent"><FaFacebookF className="text-[#D4AF37]" /></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent"><FaInstagram className="text-[#D4AF37]" /></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent"><FaYoutube className="text-[#D4AF37]" /></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent"><FaLinkedinIn className="text-[#D4AF37]" /></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent"><FaXTwitter className="text-[#D4AF37]" /></div>
            </div>
          </div>

          <div className="w-full flex justify-center gap-6">
            <div className="flex flex-col items-start gap-2">
              <a className="text-zinc-600 text-base font-semibold underline">Shop</a>
              <a className="text-zinc-600 text-base font-semibold underline">About</a>
              <a className="text-zinc-600 text-base font-semibold underline">Journal</a>
              <a className="text-zinc-600 text-base font-semibold underline">Contact</a>
              <a className="text-zinc-600 text-base font-semibold underline">Careers</a>
            </div>
            <div className="flex flex-col items-start gap-2">
              <a className="text-zinc-600 text-base font-semibold underline">Press</a>
              <a className="text-zinc-600 text-base font-semibold underline">Stockists</a>
              <a className="text-zinc-600 text-base font-semibold underline">Gift cards</a>
              <a className="text-zinc-600 text-base font-semibold underline">Sustainability</a>
              <a className="text-zinc-600 text-base font-semibold underline">Shipping</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="hidden md:block bg-[#E8E6E1] px-6 md:px-16 lg:px-24 py-10 font-[Manrope] font-semibold text-sm md:text-base leading-[160%] tracking-wider">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-8 md:space-y-0">
        {/* Address & Contact */}
        <div className="space-y-2">
          <p className="mb-1 text-[#2A2520] text-lg md:text-lg tracking-wider">Address</p>
          <p className="text-xs opacity-80 mb-3 text-[#46403A] md:text-[10px] lg:text-sm">Vesarii Fragrance House, Paris, France</p>

          <div className="mt-6">
            <p className="mb-1 text-[#2A2520] text-lg md:text-lg">Contact</p>
            <p className="text-sm md:text-sm opacity-80 cursor-pointer text-[#3B3630] tracking-wide underline">+33 1 23 45 67</p>
            <p className="text-sm md:text-sm opacity-80 cursor-pointer text-[#3B3630] tracking-wide underline">contact@vesarii.com</p>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10 text-xs md:text-[10px] lg:text-sm transform -translate-x-0 lg:-translate-x-0">
          <div className="space-y-3">
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Shop</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">About</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Journal</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Contact</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Careers</p>
          </div>
          <div className="space-y-3">
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Press</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Stockists</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Gift cards</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Sustainability</p>
            <p className="cursor-pointer text-[#5B5751] tracking-wide underline">Shipping</p>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D9C8A0]/40 transition-colors"><FaFacebookF className="text-sm text-[#D4AF37]" /></div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D9C8A0]/40 transition-colors"><FaInstagram className="text-sm text-[#D4AF37]" /></div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D9C8A0]/40 transition-colors"><FaXTwitter className="text-sm text-[#D4AF37]" /></div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D9C8A0]/40 transition-colors"><FaLinkedinIn className="text-sm text-[#D4AF37]" /></div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D9C8A0]/40 transition-colors"><FaYoutube className="text-sm text-[#D4AF37]" /></div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#BFBAB2]/50 pt-4 text-xs md:text-[10px]">
        <p className="text-[#66605A] md:text-xs lg:text-sm tracking-wider">© 2024 Vesarii. All rights reserved.</p>
        <div className="flex md:gap-6 lg:gap-8 gap-4 lg:mt-0 md:mt-0 mt-3">
          <p className="cursor-pointer text-[#66605A] md:text-xs lg:text-sm tracking-wide underline">Privacy policy</p>
          <p className="cursor-pointer text-[#66605A] md:text-xs lg:text-sm tracking-wide underline">Terms of service</p>
          <p className="cursor-pointer text-[#66605A] md:text-xs lg:text-sm tracking-wide underline">Cookies settings</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;