export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 font-sans">
      <h1 className="text-4xl font-playfair font-bold text-[#1F1235] mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-8">Have a question about our sisterhood, or want to partner with us? We'd love to hear from you.</p>
      
      <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-sm">
        <p className="text-lg font-medium text-text-primary mb-6">
          For general inquiries, support, or partnership opportunities, please email us directly:
        </p>
        <a href="mailto:hello@purplegirl.in" className="text-2xl font-bold text-[#7C3AED] hover:underline">
          hello@purplegirl.in
        </a>
        <p className="text-sm text-gray-500 mt-8">
          Please note: We do not accept personal advice questions via email. Please use the <a href="/ask" className="text-purple-600 hover:underline">Ask page</a> to submit an anonymous question to the community.
        </p>
      </div>
    </div>
  );
}
