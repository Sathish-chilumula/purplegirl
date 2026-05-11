import { Metadata } from 'next';

const SITE_URL = 'https://purplegirl.in';

interface DisclaimerPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: DisclaimerPageProps): Promise<Metadata> {
  const { lang } = await params;
  const canonical = lang === 'en' ? '/disclaimer' : `/${lang}/disclaimer`;
  return {
    title: 'Disclaimer | PurpleGirl',
    description: 'Important legal disclaimer regarding the health and wellness information provided on PurpleGirl.',
    alternates: { canonical, languages: { 'en': `${SITE_URL}/disclaimer`, 'x-default': `${SITE_URL}/disclaimer` } },
  };
}

export const runtime = 'edge';

export default function DisclaimerPage() {
  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-pg-gray-100 font-sans">
        
        <h1 className="text-4xl font-display font-bold text-pg-gray-900 mb-8">Disclaimer</h1>

        <div className="prose prose-sm md:prose-base text-pg-gray-700 space-y-8 max-w-none">
          
          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">1. No Medical Advice</h2>
            <p>
              The content on PurpleGirl.in, including text, graphics, images, and other material, is for <strong>informational and educational purposes only</strong>. The content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
            </p>
            <p>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">2. AI-Generated Content</h2>
            <p>
              PurpleGirl utilizes Artificial Intelligence (AI) tools to help draft certain articles, community answers, and guides. While we strive to maintain high editorial standards, AI-generated content may occasionally contain inaccuracies. This content should be treated as a starting point for information and should be cross-referenced with professional sources.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">3. No Professional-Client Relationship</h2>
            <p>
              Your use of this website does not establish a doctor-patient, therapist-client, or any other professional-client relationship between you and PurpleGirl or its contributors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">4. Information Accuracy</h2>
            <p>
              While we make every effort to ensure the information on this site is accurate and up-to-date, PurpleGirl makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">5. External Links</h2>
            <p>
              This website may contain links to external websites that are not provided or maintained by or in any way affiliated with PurpleGirl. Please note that PurpleGirl does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">6. Advertising Disclosure</h2>
            <p>
              This website may use third-party advertising companies (such as Google AdSense) to serve ads when you visit. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
          </section>

          <section className="bg-pg-cream p-6 rounded-2xl border border-pg-rose/10 italic">
            "If you are experiencing a medical emergency, mental health crisis, or are in immediate danger, please contact your local emergency services or a crisis hotline immediately."
          </section>

        </div>
      </div>
    </div>
  );
}
