"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (href: string) =>
    pathname === href
      ? "text-[#1b6cae]  border-b border-[#1b6cae] pb-0.5"
      : "text-gray-800 ";

  const menuItems = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Our Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If scrolling down, hide the header
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true);
      }
      // If scrolling up, show the header
      else {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 bg-white "
        initial={{ y: 0 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ ease: "linear", duration: 0.3 }}
      >
        <nav className="container  mx-auto px-4 flex justify-between items-center font-['poppins'] font-light">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[#1b6cae]">
            <Image
              src={"/logo.webp"}
              alt="TradeData Nexus"
              width={150}
              height={60}
            />
          </Link>

          {/* Menu Icon */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              className="text-gray-700 text-3xl focus:outline-none"
              onClick={toggleMenu}
            >
              <FiMenu />
            </button>
          </div>

          {/* Navigation Links for Desktop */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`${isActive(
                  item.href
                )} text-sm md:text-sm lg:text-lg hover:text-[#1d94d0] font-sans`}
                onClick={() => isActive(item.href)} // Set active on click
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Button for Desktop */}
          <Button className="hidden md:block bg-[#1b6cae] hover:bg-[#1d94d0] text-white text-sm md:text-md lg:text-[.9vw] rounded-[.4vw]">
            <Link href="/contact">Get Started</Link>
          </Button>
        </nav>
      </motion.header>

      {/* Sliding Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-3/4 max-w-[300px] h-fit pb-6 bg-white shadow-md rounded-bl-[1vw] transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center px-4 py-4">
          <Link href="/" className="text-xl font-bold text-[#1b6cae]">
            {/* Logo here if needed */}
          </Link>

          {/* Close Button */}
          <button
            aria-label="Close menu"
            className="text-gray-700 text-2xl focus:outline-none"
            onClick={toggleMenu}
          >
            <FiX />
          </button>
        </div>
        {/* Menu Links */}
        <div className="px-4 py-6 space-y-7">
          <div className="flex flex-col items-start space-y-3">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={toggleMenu}
                className={`${isActive(
                  item.href
                )} text-md hover:text-violet-700 font-semibold w-full text-left`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full text-white text-sm md:text-md lg:text-[.9vw] rounded-[.9vw]">
            <Link href="/contact" onClick={toggleMenu}>
              Get Started
            </Link>
          </Button>
        </div>
      </div>

      {/* Overlay for small screens */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 transition-opacity duration-200 z-30 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Header;
