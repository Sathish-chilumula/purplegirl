import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-pg-gray-100 font-sans">
        
        <h1 className="text-4xl font-display font-bold text-pg-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-pg-gray-500 mb-8 border-b border-pg-gray-100 pb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-sm md:prose-base text-pg-gray-700 space-y-8 max-w-none">
          
          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using PurpleGirl.in, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">2. Age Restriction</h2>
            <p>
              PurpleGirl is intended for users who are at least 13 years of age. By using this site, you represent and warrant that you are at least 13 years old. If you are under 13, you may not use or access this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">3. User Content & Community Guidelines</h2>
            <p>
              PurpleGirl is a safe space. You agree not to submit any questions or content that contain personally identifiable information, harassment, hate speech, explicit content, or illegal material. We reserve the right to refuse service, terminate access, or remove content that violates these community guidelines at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">4. Medical & Professional Disclaimer</h2>
            <p>
              The content provided on PurpleGirl is for informational and entertainment purposes only. <strong>It is not intended to be a substitute for professional medical advice, diagnosis, treatment, psychological therapy, or legal counsel.</strong> Always seek the advice of a qualified professional with any questions regarding a medical condition, legal issue, or mental health crisis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">5. AI-Generated Content Disclosure</h2>
            <p>
              To provide immediate, empathetic support to a large volume of inquiries, <strong>some articles and anonymous answers on PurpleGirl are generated with the assistance of artificial intelligence tools.</strong> While we strive for accuracy and empathy, AI-generated content should not be taken as absolute fact or professional advice. Our editorial team reviews high-traffic guides to ensure quality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">6. Intellectual Property</h2>
            <p>
              The PurpleGirl brand, logo, site design, original guides, and compilation of content are protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">7. Limitation of Liability</h2>
            <p>
              In no event shall PurpleGirl, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">9. Termination</h2>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">10. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising out of or related to these terms or the use of the website shall be subject to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-pg-rose mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:hello@purplegirl.in" className="text-pg-rose font-bold hover:underline">hello@purplegirl.in</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
