import React from "react";
import { FaChevronDown } from "react-icons/fa";

const Header = () => {
  return (
    <div className="pt-20 min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 bg-transparent text-white">
      <h1 className="text-5xl md:text-8xl font-cormorant mt-32 md:mt-0 font-medium leading-tight">
        Your Desires,
        <br />
        <span className="text-[#FB7185]">Whispered</span>
      </h1>

      <p className="text-xl font-sans mt-10 md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
        For those who want to be spoken to—not entertained.
      </p>
      <a href="#free-samples">
        <button className="inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  bg-gradient-to-r from-rose-500 to-pink-500 font-sans text-white h-12 text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_10px_rgba(255,100,150,0.7)] hover:ring-4 hover:ring-pink-400/50">
          Claim Your Free Audio
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 w-5 h-5"
          >
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </button>
      </a>

      {/* <a href="#free-samples">
        <button className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 premium-button text-lg px-8 py-4 rounded-full crimson-glow hover:scale-105 transition-all duration-300">
          Claim Your Free Audio
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 w-5 h-5"
          >
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </button>
      </a> */}
    </div>
  );
};

export default Header;
