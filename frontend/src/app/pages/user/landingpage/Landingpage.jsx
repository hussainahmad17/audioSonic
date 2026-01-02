import React from "react";
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

      
    </div>
  );
}

export default LandingPage;
