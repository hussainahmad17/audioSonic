import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only apply hide/show on small screens
      if (window.innerWidth < 768) {
        if (currentScrollY <= 10) {
          setShowNavbar(true); // show at top
        } else if (currentScrollY > lastScrollY) {
          setShowNavbar(false); // scroll down
        } else {
          setShowNavbar(true); // scroll up
        }
        setLastScrollY(currentScrollY);
      } else {
        setShowNavbar(true); // Always show on desktop
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`w-full fixed top-0 z-50 transition-all duration-300
        ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }
        bg-black/30 backdrop-blur-md border-b border-[#2a0e25]
      `}
    >
      <div className="flex flex-col gap-4 md:flex-row justify-between items-center max-w-[1440px] mx-auto px-4 py-4 text-white transition-all duration-300">
        <div className="text-xl font-cormorant">
          <span className="text-[#FB7185] font-normal">INTIMATLY</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full md:w-auto">
          {[
            { name: "Free Samples", id: "free-samples" },
            { name: "Affiliate Program", id: "faq" },
            { name: "Reviews", id: "reviews" },
            { name: "FAQs", id: "faq" },
          ].map((link, idx) => (
            <a
              key={idx}
              href={`#${link.id}`}
              className="font-cormorant text-base sm:text-lg md:text-xl text-white cursor-pointer transition hover:text-[#FB7185] font-normal"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a href="#premium">
            <button className="px-4 py-2 rounded-lg font-sans text-white text-sm font-medium bg-[#562D37] border border-[#FF0808] border-opacity-40 shadow-md hover:bg-[#B06959] transition ">
              Costumize Audio
            </button>
          </a>
          <a href="#browse-library">
            <button className="px-4 py-2 rounded-lg font-sans text-white text-sm font-medium bg-[#403B3C] border border-white border-opacity-40 hover:bg-[#81704E] transition ">
              Audio Library
            </button>
          </a>
          <a href="#browse-library">
            <button className="px-4 py-2 rounded-lg font-sans text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_12px_#ff0066] hover:shadow-[0_0_20px_#ffcc00] transition ">
              Premium Audios
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
