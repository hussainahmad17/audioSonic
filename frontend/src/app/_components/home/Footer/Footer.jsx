import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#000000] via-[#0f0c29] to-[#24243e] text-gray-300 pt-12 pb-6 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold font-cormorant text-rose-400">INTIMATLY</h1>
          <p className="text-md italic">
            Voices made for your mind, body, and soul.
          </p>
          <p className="text-sm text-gray-400">© 2025 INTIMATLY. All rights reserved.</p>
        </div>

        <div className="space-y-3 text-sm text-center md:text-left">
          <h3 className="text-white font-semibold text-lg font-sans mb-2">Explore</h3>
          {[
            { label: "Browse Library", href: "#browse-library" },
            { label: "Free Samples", href: "#free-samples" },
            { label: "Affiliate Program", href: "#faq" },
            { label: "Reviews", href: "#reviews" },
            { label: "FAQs", href: "#faq" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="block hover:text-rose-400 transition-colors font-sans duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="space-y-3 text-sm text-center md:text-right">
          <h3 className="text-white font-semibold font-sans text-lg mb-2">Legal & Contact</h3>
          <a
            href="#privacy"
            className="block hover:text-rose-400 transition-colors font-sans  duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="block hover:text-rose-400 transition-colors font-sans  duration-200"
          >
            Terms & Conditions
          </a>
          <a
            href="#consent"
            className="block hover:text-rose-400 transition-colors font-sans  duration-200"
          >
            18+ Consent Notice
          </a>
          <p className="text-gray-400 text-xs mt-2">
            Email:{" "}
            <a
              href="mailto:support@yourdomain.com"
              className="hover:text-rose-400"
            >
              support@yourdomain.com
            </a>
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">Want something personal?</p>
        <a
          href="#premium"
          className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-semibold py-2 px-5 rounded-full transition-transform hover:scale-105 shadow-md"
        >
          Whisper Your Desire
        </a>
      </div>
    </footer>
  );
};

export default Footer;
