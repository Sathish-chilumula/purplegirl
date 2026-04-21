import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 font-sans">
      <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#1F1235] mb-8">About PurpleGirl 💜</h1>
      <div className="prose prose-purple lg:prose-lg text-gray-700 space-y-6">
        <p>
          Welcome to PurpleGirl, the internet's safest space for women and girls to ask questions, share experiences, and get honest, judgment-free answers.
        </p>
        <h2 className="text-2xl font-bold text-[#7C3AED] mt-8 mb-4">Our Mission</h2>
        <p>
          We believe that every woman deserves access to reliable, empathetic, and practical advice. Whether it's a question about career growth, mental wellness, relationships, or beauty routines, we know that asking questions can sometimes feel intimidating.
        </p>
        <p>
          That's why PurpleGirl is 100% anonymous. We don't track who asks what. We just focus on providing the absolute best advice possible, curated by our sisterhood and powered by safe, deeply empathetic AI moderation.
        </p>
        <h2 className="text-2xl font-bold text-[#7C3AED] mt-8 mb-4">Join the Sisterhood</h2>
        <p>
          You don't need an account to be a part of this. Just browse, ask, and share. If you find an answer that helps you, click "Me Too" or share it with a friend who might need it.
        </p>
        <div className="mt-12 pt-8 border-t border-purple-100">
          <Link href="/ask" className="inline-block bg-[#7C3AED] text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition">
            Ask a Question Anonymously
          </Link>
        </div>
      </div>
    </div>
  );
}
