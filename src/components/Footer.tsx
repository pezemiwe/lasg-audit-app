import React from "react";
import { Mail, Phone, ExternalLink, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t-8 border-[#3D1F00]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img
                className="h-10 w-auto"
                src="/assets/images/lasg__logo.png"
                alt="Lagos State Logo"
              />
              <div>
                <h3 className="text-lg font-bold uppercase leading-none text-white">
                  Lagos State
                </h3>
                <p className="text-[#F5A800] text-xs uppercase font-medium tracking-wide">
                  Audit Platform
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Ensuring transparency, accountability, and excellence in the
              management of public resources across all 20 Local Government
              Areas.
            </p>
          </div>
          <div>
            <h4 className="text-[#F5A800] font-bold text-sm uppercase tracking-wider mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Audit Mandates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Regulations & Standards
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LGA Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Financial Reports
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F5A800] font-bold text-sm uppercase tracking-wider mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-[#F5A800]">
                  <MapPin className="w-4 h-4" />
                </span>
                <span>
                  No. 1, Audit Road,
                  <br />
                  Alausa, Ikeja,
                  <br />
                  Lagos State.
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-[#F5A800]">
                  <Phone className="w-4 h-4" />
                </span>
                <span>+234 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-[#F5A800]">
                  <Mail className="w-4 h-4" />
                </span>
                <span>auditorgeneral@lagosstate.gov.ng</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F5A800] font-bold text-sm uppercase tracking-wider mb-6">
              Government Links
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <a
                  href="https://lagosstate.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Lagos State Government
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Ministry of Finance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Lagos State Government. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
