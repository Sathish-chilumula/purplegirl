import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 font-sans">
      <h1 className="text-4xl font-playfair font-bold text-[#1F1235] mb-8">Privacy Policy</h1>
      <div className="prose prose-sm text-gray-700 space-y-6">
        <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-bold text-[#7C3AED]">1. Information We Collect</h2>
        <p>PurpleGirl is designed to be an anonymous platform. When you ask a question, we do not require you to create an account, provide your name, or share your email address. We only collect the content of the questions you submit to provide answers.</p>

        <h2 className="text-xl font-bold text-[#7C3AED]">2. Cookies and Tracking (Google AdSense)</h2>
        <p>We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use cookies (like the DoubleClick cookie) to serve ads based on your prior visits to our website or other websites.</p>
        <p>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="nofollow" className="text-purple-600 hover:underline">Google Ads Settings</a>.</p>

        <h2 className="text-xl font-bold text-[#7C3AED]">3. Analytics</h2>
        <p>We may use anonymous analytics tools to measure traffic and usage trends on our site. This helps us understand what content is most helpful to our community.</p>

        <h2 className="text-xl font-bold text-[#7C3AED]">4. Third-Party Links</h2>
        <p>Our answers may contain affiliate links to products. Clicking on these links may place a cookie on your browser, allowing us to earn a small commission at no extra cost to you.</p>

        <h2 className="text-xl font-bold text-[#7C3AED]">5. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please <Link href="/contact" className="text-purple-600 hover:underline">contact us</Link>.</p>
      </div>
    </div>
  );
}
