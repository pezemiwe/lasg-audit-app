import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#3D1F00] border-b-4 border-[#F5A800] relative z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="bg-white p-1 rounded-full shadow-sm mr-3">
                <img
                  className="h-14 w-auto object-contain"
                  src="/assets/images/lasg__logo.png"
                  alt="Lagos State Coat of Arms"
                />
              </div>
              <div className="hidden md:flex flex-col text-white">
                <span className="font-bold text-lg leading-tight tracking-wide uppercase font-serif">
                  Lagos State
                </span>
                <span className="text-[#F5A800] text-xs font-semibold uppercase tracking-widest">
                  Audit Automation Platform
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1 lg:space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 uppercase tracking-wide ${
                    isActive
                      ? "text-[#F5A800] bg-white/10 shadow-inner"
                      : "text-gray-200 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/regulations"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 uppercase tracking-wide ${
                    isActive
                      ? "text-[#F5A800] bg-white/10 shadow-inner"
                      : "text-gray-200 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Regulations
              </NavLink>
              <a
                href="#"
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-all duration-200 uppercase tracking-wide"
              >
                Mandates
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-all duration-200 uppercase tracking-wide"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <Link
              to="/login"
              className="bg-[#F5A800] text-[#3D1F00] hover:bg-[#D4820A] hover:text-white px-5 py-2.5 rounded shadow-lg text-sm font-bold flex items-center transition-all transform hover:-translate-y-0.5"
            >
              <User className="w-4 h-4 mr-2" />
              LOGIN
            </Link>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-[#3D1F00] inline-flex items-center justify-center p-2 rounded-md text-[#F5A800] hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#2D1600] border-t border-[#F5A800]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-bold ${
                  isActive
                    ? "text-[#F5A800] bg-black/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/regulations"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-bold ${
                  isActive
                    ? "text-[#F5A800] bg-black/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`
              }
            >
              Regulations
            </NavLink>
            <a
              href="#"
              className="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-3 rounded-md text-base font-bold"
            >
              Mandates
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-3 rounded-md text-base font-bold"
            >
              Contact Support
            </a>
            <div className="pt-4 pb-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#F5A800] text-[#3D1F00] hover:bg-[#D4820A] px-4 py-3 rounded-md text-base font-bold flex items-center justify-center shadow-lg"
              >
                <User className="w-5 h-5 mr-2" />
                Login to Platform
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
