"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X, Search, User, Phone } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/platform", label: "Platform" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Our Services" },
    { href: "/blog", label: "Blog" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800/95 backdrop-blur-md shadow-xl border-b border-white/10" 
            : "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800/80 backdrop-blur-sm"
        }`}
      >
        <nav className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Image
                  src="/logo.webp"
                  alt="TransDataNexus"
                  width={180}
                  height={50}
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-blue-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>

              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 shadow-md">
                <Phone className="w-4 h-4" />
                Request Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-300" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMenu}
          />

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 w-80 h-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 shadow-2xl z-50 lg:hidden border-l border-white/10">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Link href="/" onClick={closeMenu}>
                <Image
                  src="/logo.webp"
                  alt="TransDataNexus"
                  width={140}
                  height={40}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col h-full">
              <div className="flex-1 px-6 py-8">
                <nav className="space-y-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`block text-lg font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-blue-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="mt-8 space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                    onClick={closeMenu}
                  >
                    <Search className="w-4 h-4 mr-3" />
                    Search Platform
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
                    onClick={closeMenu}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Sign In
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-white/10">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                  <Phone className="w-4 h-4" />
                  Request Demo
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Need help?{" "}
                    <Link href="/contact" className="text-blue-400 hover:text-blue-300 font-medium">
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;
