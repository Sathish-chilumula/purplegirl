import Link from 'next/link';

export const runtime = 'edge';

export default function PrivacyPage() {
  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-pg-gray-100 font-sans">
        
        <h1 className="text-4xl font-display font-bold text-pg-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-pg-gray-500 mb-8 border-b border-pg-gray-100 pb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-sm md:prose-base text-pg-gray-700 space-y-8 max-w-none">
          
          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">1. Information We Collect</h2>
            <p>
              PurpleGirl is designed to be an anonymous platform. When you ask a question, we do not require you to create an account, provide your name, or share your email address. We only collect the content of the questions you submit to provide answers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">2. Data Retention and Deletion (GDPR)</h2>
            <p>
              Although PurpleGirl is based in India, we respect global data privacy standards, including GDPR. We retain anonymous question submissions indefinitely to help other women who might have the same questions. 
            </p>
            <p className="mt-2">
              Since submissions are anonymous, we cannot identify specific users. However, if you accidentally included personally identifiable information in a public question, you have the right to request its deletion. Please <Link href="/contact" className="text-pg-rose font-bold hover:underline">contact us</Link> with the URL of the specific page, and we will promptly remove it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">3. Data Sharing with Google (AdSense)</h2>
            <p>
              We share data with Google for advertising purposes as described in Google's Privacy Policy. 
              We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. 
              These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <p className="mt-2">
              For more information about how Google uses data, please visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="nofollow" className="text-pg-rose font-bold hover:underline">How Google uses information from sites or apps that use our services</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">4. Cookie Policy & Consent</h2>
            <p>
              PurpleGirl uses cookies to ensure you get the best experience on our website. By using our website, you consent to our use of cookies. We use the following types of cookies:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>Functional Cookies:</strong> Necessary for the website to function correctly (e.g., remembering your quiz progress).</li>
              <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with the website anonymously, helping us improve our content.</li>
              <li><strong>Advertising Cookies (DoubleClick):</strong> Google, as a third-party vendor, uses cookies to serve ads on PurpleGirl. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
            </ul>
            <p className="mt-3">
              Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="nofollow" className="text-pg-rose font-bold hover:underline">Google Ads Settings</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">5. Third-Party Links</h2>
            <p>
              Our guides and answers may contain links to external sites that are not operated by us. Clicking on these links may place a cookie on your browser. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@purplegirl.in" className="text-pg-rose font-bold hover:underline">hello@purplegirl.in</a> 
              {' '}or visit our <Link href="/contact" className="text-pg-rose font-bold hover:underline">Contact page</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
