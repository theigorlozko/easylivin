import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";
import NewRooms from "./NewRooms";

const Landing = () => {
  return (
    <div>
      <HeroSection />
      {/* <FeaturesSection /> */}
      <NewRooms/>
      {/* <DiscoverSection /> */}
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default Landing;
