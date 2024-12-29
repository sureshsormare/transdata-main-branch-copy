import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className='bg-gray-800 text-white py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-3'>
            <Link href='/' className='text-2xl font-bold text-violet-700'>
              <Image
                src={"/logo.webp"}
                alt='TradeData Nexus'
                width={100}
                height={30}
                className='bg-white'
              />
            </Link>
            <p className='text-sm pointer-events-none'>
              Providing insights into international trade data for pharma
              products.
            </p>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='hover:text-violet-400 text-sm xl:text-md'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-violet-400 text-sm xl:text-md'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/services' className='hover:text-violet-400 text-sm xl:text-md'>
                  Services
                </Link>
              </li>
              <li>
                <Link href='/pricing' className='hover:text-violet-400 text-sm xl:text-md'>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Legal</h4>
            <ul className='space-y-2'>
              <li>
                <Link href='/privacy-policy' className='hover:text-violet-400 text-sm xl:text-md'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms-and-conditions'
                  className='hover:text-violet-400 text-sm xl:text-md'
                >
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h4 className='text-lg font-semibold mb-4'>Contact Us</h4>
            <p className='text-sm'>Email: info@tradedatanexus.com</p>
            <p className='text-sm'>Phone: +1 (020) 23142-4232</p>
          </div>
        </div>
        <div className='mt-8 text-center text-sm pointer-events-none'>
          © {date} TradeDataNexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
