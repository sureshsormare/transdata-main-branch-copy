import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <nav className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold text-violet-700'>
          <Image
            src={"/logo.webp"}
            alt='TradeData Nexus'
            width={150}
            height={60}
          />
        </Link>
        <div className='space-x-6'>
          <Link
            href='/'
            className='text-gray-700 hover:text-violet-700 font-semibold'
          >
            Home
          </Link>
          <Link
            href='/about'
            className='text-gray-700 hover:text-violet-700 font-semibold'
          >
            About Us
          </Link>
          <Link
            href='/services'
            className='text-gray-700 hover:text-violet-700 font-semibold'
          >
            Services
          </Link>
          <Link
            href='/pricing'
            className='text-gray-700 hover:text-violet-700 font-semibold'
          >
            Pricing
          </Link>
          <Link
            href='/contact'
            className='text-gray-700 hover:text-violet-700 font-semibold'
          >
            Contact Us
          </Link>
        </div>
        <Button className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl'>
          <Link href='/contact'>Get Started</Link>
        </Button>
      </nav>
    </header>
  );
};

export default Header;
