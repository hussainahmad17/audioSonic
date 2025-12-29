import React, { useState, useEffect } from "react";
import Footer from "@app/_components/home/Footer/Footer";
import Header from "@app/_components/home/Header/Header";
import Navbar from "@app/_components/home/Navbar/Navbar";
import PremiumAudios from "@app/_components/home/PremiumAudios/PremiumAudios";
import PremiumAudioSection from "@app/_components/home/PremiumAudioSection/PremiumAudioSection";
import ReferAndEarn from "@app/_components/home/ReferAndEarn/ReferAndEarn";
import ReviewsSection from "@app/_components/home/ReviewsSection/ReviewsSection";
import SampleCards from "@app/_components/home/SampleCards/SampleCards";
import { ShieldAlert, UserCheck } from "lucide-react";
import SanctuarySection from "@app/_components/home/SanctuarySection/SanctuarySection";
function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleVerification = (verified) => {
    if (verified) {
      setShowModal(false);
    }
  };

  return (
    <div className="landing-wrapper relative">
      <div className="home-background" />
      <div className="home-content">
        <Navbar />
        <Header />
        <SampleCards />
        <PremiumAudios />
        <SanctuarySection/>
        <PremiumAudioSection />
        <ReferAndEarn />
        <ReviewsSection />
        <Footer />
      </div>

      {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black/40 border border-rose-400/40 shadow-2xl rounded-2xl max-w-2xl w-full p-8 text-center text-white relative">
        <div className="mb-4 flex items-center justify-center gap-2">
          <ShieldAlert className="text-rose-400 w-6 h-6" />
          <h2 className="text-2xl md:text-3xl font-bold font-cormorant text-white">
            Age Verification
          </h2>
          <ShieldAlert className="text-rose-400 w-6 h-6" />
        </div>
        <p className="text-lg text-rose-400 font-sans font-medium mb-2">
          🔞 Adult Content Ahead
        </p>
        <p className="text-sm text-gray-300 mb-6 max-w-md mx-auto font-sans">
          You must be 18 years or older to access this content. Please confirm your age to proceed.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleVerification(false)}
            className="px-3 md:px-5 py-2 border border-gray-400 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg font-sans transition-all"
          >
            I'm under 18
          </button>
          <button
            onClick={() => handleVerification(true)}
            className="px-3 md:px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg shadow-md font-sans flex items-center gap-1 md:gap-2 transition-all"
          >
            <UserCheck className="w-5 h-5" />
            I'm 18 or older
          </button>
        </div>
        <p className="mt-6 text-xs text-gray-400 font-sans italic">
          Your privacy is respected — age confirmation is not stored.
        </p>
      </div>
    </div>
      )}
    </div>
  );
}

export default LandingPage;
