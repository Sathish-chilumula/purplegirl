import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, PlusCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Real Stories & Experiences | PurpleGirl',
  description: 'Anonymous stories from women across India sharing their journeys through health, relationships, and career.',
};

export default async function StoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Mock data for scaffolding
  const stories = [
    {
      id: 1,
      title: "How I finally spoke up about my PCOS",
      content: "For years I thought the facial hair and irregular periods were just 'my fault' for not eating well. After reading guides here, I realized it's a medical condition. I went to a doctor and now I feel so much more in control...",
      author: "Anonymous",
      location: "Bangalore",
      likes: 24,
      comments: 5,
      category: "Health"
    },
    {
      id: 2,
      title: "Dealing with overbearing in-laws as a working woman",
      content: "It's hard to balance a 9-6 job and then come home to expectations of being a 'perfect bahu'. I started setting small boundaries, like having my morning tea alone. It sounds small but it saved my mental health...",
      author: "Anonymous",
      location: "Delhi",
      likes: 42,
      comments: 12,
      category: "Relationships"
    },
    {
      id: 3,
      title: "My first promotion and the guilt that came with it",
      content: "I felt like I was taking time away from my toddler, but then I realized I'm building a future for her. We need to stop apologizing for our ambitions...",
      author: "Anonymous",
      location: "Mumbai",
      likes: 18,
      comments: 3,
      category: "Career"
    }
  ];

  return (
    <div className="bg-pg-cream min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-pg-rose-light text-pg-rose px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            Community Voice
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-pg-gray-900 mb-6 leading-tight">
            Real Stories, <span className="text-pg-rose">Real Women.</span>
          </h1>
          <p className="text-xl text-pg-gray-600 max-w-2xl mx-auto mb-10">
            A safe, anonymous space to share your experiences and learn from other women who have walked the same path.
          </p>
          <Button className="rounded-full px-8 py-6 text-lg shadow-lg shadow-pg-rose/20">
            <PlusCircle className="mr-2" /> Share Your Story
          </Button>
        </header>

        <div className="grid gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="p-8 md:p-10 hover:shadow-xl transition-shadow border-none shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-pg-plum-light text-pg-plum text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {story.category}
                </span>
                <span className="text-pg-gray-400 text-sm font-medium">{story.location}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-pg-gray-900 mb-4 group-hover:text-pg-rose transition-colors">
                {story.title}
              </h2>
              <p className="text-pg-gray-600 leading-relaxed text-lg mb-8 line-clamp-3 md:line-clamp-none">
                "{story.content}"
              </p>
              <div className="flex items-center justify-between border-t border-pg-gray-50 pt-6">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-pg-gray-400 hover:text-pg-rose transition-colors">
                    <Heart size={20} />
                    <span className="text-sm font-bold">{story.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-pg-gray-400 hover:text-pg-plum transition-colors">
                    <MessageCircle size={20} />
                    <span className="text-sm font-bold">{story.comments}</span>
                  </button>
                </div>
                <button className="text-pg-gray-400 hover:text-pg-gray-900 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <footer className="mt-16 text-center">
          <p className="text-pg-gray-400 text-sm italic">
            All stories are shared anonymously. Your privacy is our priority. 💜
          </p>
        </footer>
      </div>
    </div>
  );
}
