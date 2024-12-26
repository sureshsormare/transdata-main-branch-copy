export default function PrivacyPolicy() {
  const date = new Date();
  return (
    <div className='container mx-auto px-4 py-16'>
      <h1 className='text-4xl font-bold mb-8 text-violet-700'>
        Privacy Policy
      </h1>
      <div className='prose max-w-none'>
        <p>Last updated: {date.toLocaleDateString()}</p>
        <p>
          TradeDataNexus is committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website tradedatanexus.com or use our
          services.
        </p>
        <h2 className='text-2xl font-semibold mt-8 mb-4 text-violet-600'>
          Information We Collect
        </h2>
        <p>We collect information that you provide directly to us, such as:</p>
        <ul className='list-disc pl-6 mb-4'>
          <li>
            Personal information (e.g., name, email address, phone number)
          </li>
          <li>Company information</li>
          <li>Login credentials</li>
          <li>Payment information</li>
          <li>Any other information you choose to provide</li>
        </ul>
        <p>
          We also automatically collect certain information when you visit our
          website, including:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device information</li>
          <li>Usage data</li>
        </ul>
        <h2 className='text-2xl font-semibold mt-8 mb-4 text-violet-600'>
          How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className='list-disc pl-6 mb-4'>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices, updates, and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Develop new products and services</li>
          <li>
            Detect, investigate, and prevent fraudulent transactions and other
            illegal activities
          </li>
        </ul>
        <h2 className='text-2xl font-semibold mt-8 mb-4 text-violet-600'>
          Sharing of Information
        </h2>
        <p>We may share your information with:</p>
        <ul className='list-disc pl-6 mb-4'>
          <li>Service providers who perform services on our behalf</li>
          <li>
            Business partners with whom we jointly offer products or services
          </li>
          <li>
            Law enforcement or other government entities as required by law
          </li>
        </ul>
        <h2 className='text-2xl font-semibold mt-8 mb-4 text-violet-600'>
          Data Security
        </h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect the security of your personal information. However, please
          note that no method of transmission over the Internet or electronic
          storage is 100% secure.
        </p>
        <h2 className='text-2xl font-semibold mt-8 mb-4 text-violet-600'>
          Your Rights
        </h2>
        <p>You have the right to:</p>
        <ul className='list-disc pl-6 mb-4'>
          <li>Access, correct, or delete your personal information</li>
          <li>Object to or restrict the processing of your data</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <h2 className='text-2xl font-semibold mt-8 mb-4 text-violet-600'>
          Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the Last updated date.
        </p>
        {/* <h2 className='text-2xl font-semibold mt-8 mb-4 text-violet-600'>
          Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>
          TradeDataNexus
          <br />
          Email: privacy@tradedatanexus.com
          <br />
          Phone: [Your Phone Number]
        </p> */}
      </div>
    </div>
  );
}
