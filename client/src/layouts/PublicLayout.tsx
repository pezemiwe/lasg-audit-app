import React, { type ReactNode } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

interface PublicLayoutProps {
  children?: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-gray-900 bg-transparent">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
