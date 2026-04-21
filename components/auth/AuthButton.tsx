'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserCircle, LogOut, Loader2 } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        router.refresh(); // Refresh Server Components
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full border-2 border-purple-100 flex items-center justify-center animate-pulse"><Loader2 className="w-4 h-4 text-purple-200 animate-spin" /></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          href="/journey" 
          className="hidden md:block text-sm font-bold text-text-secondary hover:text-purple-primary transition-colors"
        >
          My Journey
        </Link>
        <button 
          onClick={handleSignOut}
          className="text-text-secondary hover:text-pink-accent transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <Link 
      href="/login" 
      className="text-purple-primary hover:text-purple-700 font-bold text-sm flex items-center gap-1 transition-colors"
    >
      <UserCircle className="w-5 h-5" />
      <span className="hidden md:inline">Sign In</span>
    </Link>
  );
}
