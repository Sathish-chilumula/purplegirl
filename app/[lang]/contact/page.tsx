import { Metadata } from 'next';

const SITE_URL = 'https://purplegirl.in';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const canonical = lang === 'en' ? '/contact' : `/${lang}/contact`;
  return {
    title: 'Contact Us | PurpleGirl',
    description: 'Get in touch with PurpleGirl. We\'d love to hear your feedback, questions, or partnership ideas.',
    alternates: { canonical, languages: { 'en': `${SITE_URL}/contact`, 'x-default': `${SITE_URL}/contact` } },
  };
}

export const runtime = 'edge';
export default function ContactPage() {
  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto font-sans">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-pg-gray-900 mb-4">Contact Us</h1>
          <p className="text-pg-gray-600 text-lg">
            Have a question, feedback, or want to partner with us? We'd love to hear from you.
          </p>
        </div>
        
        <div className="bg-white border border-pg-rose/10 rounded-3xl p-8 md:p-12 shadow-sm">
          
          <div className="mb-10 text-center">
            <p className="text-lg font-medium text-pg-gray-800 mb-2">
              Email us directly at:
            </p>
            <a href="mailto:hello@purplegirl.in" className="text-2xl font-bold text-pg-rose hover:underline">
              hello@purplegirl.in
            </a>
          </div>

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-pg-gray-100"></div>
            <span className="flex-shrink-0 mx-4 text-pg-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-pg-gray-100"></div>
          </div>

          <form action="https://formspree.io/f/YOUR_FORMSPREE_URL" method="POST" className="space-y-6 mt-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-pg-gray-700 mb-2">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Priya"
                  className="w-full px-4 py-3 rounded-xl border border-pg-gray-200 focus:border-pg-rose focus:ring-1 focus:ring-pg-rose outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-pg-gray-700 mb-2">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="priya@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-pg-gray-200 focus:border-pg-rose focus:ring-1 focus:ring-pg-rose outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-pg-gray-700 mb-2">Your Question / Message</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows={5}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 rounded-xl border border-pg-gray-200 focus:border-pg-rose focus:ring-1 focus:ring-pg-rose outline-none transition-colors resize-y"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-pg-rose text-white font-bold py-4 rounded-xl hover:bg-pg-rose-dark transition-colors shadow-sm text-lg"
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-pg-gray-100 text-center">
            <p className="text-sm text-pg-gray-500">
              <strong>Need personal advice?</strong> We do not answer personal advice questions via this contact form. 
              Please use our <a href="/ask" className="text-pg-rose font-bold hover:underline">Ask page</a> to submit an anonymous question to the community.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
