import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Bookmark, Settings, Heart, ArrowRight } from 'lucide-react';
import { supabase as publicSupabase } from '@/lib/supabase';

export default async function JourneyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Define some placeholder UI for saved items right now
  const metadata = user.user_metadata || {};

  return (
    <div className="min-h-screen bg-[#FAF5FF] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-pink-100 opacity-50">
            <Sparkles className="w-32 h-32" />
          </div>
          
          <div className="relative z-10">
            <h1 className="font-playfair font-bold text-4xl md:text-5xl text-purple-primary mb-4">
              My Journey 💜
            </h1>
            <p className="text-text-secondary text-lg max-w-xl">
              Welcome to your personal dashboard. Save your favorite advice, track your routines, and personalize your PurpleGirl experience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quick Stats / Preferences */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm relative group overflow-hidden hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2.5 rounded-full text-purple-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg text-text-primary">Profile Traits</h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Set up your skin type, hair porosity, and goals to get highly personalized AI answers.
              </p>
              
              <Link href="/journey/preferences" className="text-sm font-bold text-purple-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Update Preferences <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-primary to-pink-accent rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <Heart className="w-32 h-32" />
               </div>
               <h3 className="font-bold text-xl mb-2 relative z-10">PurpleGirl Premium</h3>
               <p className="text-sm text-purple-50 mb-4 relative z-10">
                 Unlock daily customized glow-up plans and ad-free experience.
               </p>
               <button className="bg-white text-purple-primary text-sm font-bold px-4 py-2 rounded-full relative z-10 hover:bg-gray-50 transition-colors">
                 Learn More
               </button>
            </div>
          </div>

          {/* Saved Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-100 shadow-sm min-h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-2.5 rounded-full text-pink-accent">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-2xl text-text-primary">Saved Answers</h2>
                </div>
              </div>

              {/* Empty State for Now */}
              <div className="text-center py-16 px-4 bg-[#FAF5FF] border border-dashed border-purple-200 rounded-2xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-purple-primary text-2xl">
                  📚
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-2">No saved answers yet</h3>
                <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">
                  When you read helpful advice, tap the bookmark icon to save it here for quick access later!
                </p>
                <Link href="/search" className="inline-flex bg-purple-primary text-white font-bold px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors text-sm">
                  Explore Topics
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
