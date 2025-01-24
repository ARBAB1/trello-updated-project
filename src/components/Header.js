"use client";
import { useState } from "react";
import Image from "next/image";

const Header = ({ onToggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onToggleSidebar(!isMobileMenuOpen); // Notify parent to toggle sidebar
  };

  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Logo and Hamburger Icon */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Icon */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Logo */}
          <Image
            src="/trello.png"
            alt="Trello Logo"
            width={32}
            height={32}
          />
            {/* Right Section: Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <button className="hover:text-gray-300">Workspaces</button>
          <button className="hover:text-gray-300">Recent</button>
          <button className="hover:text-gray-300">Starred</button>
          <button className="hover:text-gray-300">Templates</button>
         
        </nav>
        </div>

      

        {/* Right Section: Search and Account (Hidden on small screens) */}
        <div className="hidden md:flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white px-4 py-1 rounded-lg focus:outline-none"
          />
          <button className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button className="bg-gray-700 w-8 h-8 rounded-full text-white flex items-center justify-center">
            GA
          </button>
        </div>
      </div>

      {/* Mobile Menu (Visible only on small screens) */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-800 mt-2 p-4 space-y-2 rounded-lg">
          <button className="block text-gray-300 hover:text-white">Workspaces</button>
          <button className="block text-gray-300 hover:text-white">Recent</button>
          <button className="block text-gray-300 hover:text-white">Starred</button>
          <button className="block text-gray-300 hover:text-white">Templates</button>
      
        </nav>
      )}
    </header>
  );
};

export default Header;
