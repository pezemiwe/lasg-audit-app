import React from "react";
import Navbar from "../../components/Layout/Navbar";
import Hero from "../../components/Landing/Hero";
import Ticker from "../../components/Landing/Ticker";
import Mandate from "../../components/Landing/Mandate";
import AuditTypes from "../../components/Landing/AuditTypes";
import Zones from "../../components/Landing/Zones";
import AISection from "../../components/Landing/AISection";
import Roles from "../../components/Landing/Roles";
import CTA from "../../components/Landing/CTA";
import Footer from "../../components/Layout/Footer";
import Cursor from "../../components/UI/Cursor";

const Landing: React.FC = () => {
  return (
    <>
      <Cursor />
      <Ticker />
      <Navbar />
      <main>
        <Hero />
        <Mandate />
        <AuditTypes />
        <Zones />
        <AISection />
        <Roles />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default Landing;
