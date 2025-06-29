import Image from "next/image";
import Link from "next/link";
import { FaLink, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const date = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #60a5fa 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, #34d399 0%, transparent 50%)`,
        }}></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Company Info */}
            <div className="space-y-3">
              <Link href="/" className="inline-block group">
                <div className="bg-white rounded-lg p-2 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src="/logo.webp"
                    alt="TradeData Nexus"
                    width={100}
                    height={30}
                    className="h-7 w-auto"
                  />
                </div>
              </Link>
              
              <p className="text-gray-300 text-sm">
                Empowering global pharmaceutical trade with comprehensive data insights.
              </p>
              
              <div className="text-xs text-gray-400">
                <p className="font-medium text-white mb-1">📍 Office Address:</p>
                <address className="not-italic leading-relaxed">
                  3VG6+R3G, Kolivery Village, Mathuradas Colony, Kalina, Vakola,
                  Santacruz East, Mumbai, Maharashtra 400098
                </address>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white relative pb-1">
                Quick Links
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
              </h4>
              <ul className="space-y-1.5">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'About Us' },
                  { href: '/services', label: 'Services' },
                  { href: '/pricing', label: 'Pricing' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 text-sm"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Contact Combined */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white relative pb-1">
                Legal & Support
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
              </h4>
              <ul className="space-y-1.5">
                {[
                  { href: '/privacy-policy', label: 'Privacy Policy' },
                  { href: '/terms-and-conditions', label: 'Terms & Conditions' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 text-sm"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white relative pb-1">
                Contact Us
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></span>
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 text-sm">✉️</span>
                  <a 
                    href="mailto:info@transdatanexus.com"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    info@transdatanexus.com
                  </a>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-sm">📞</span>
                  <a 
                    href="tel:+919595078788"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    +91 95950 78788
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-2 pt-2">
                {[
                  { icon: <FaLinkedin />, label: 'Website', href: 'https://www.linkedin.com/company/transdatanexus/' },
                  { icon: <FaLink />, label: 'LinkedIn', href: '#' },
                  // { icon: '📘', label: 'Facebook', href: '#' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                    title={social.label}
                  >
                    <span className="text-xs">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {date} TransDataNexus. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span>Online</span>
              </span>
              <span>50M+ Records</span>
              <span>180+ Countries</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;