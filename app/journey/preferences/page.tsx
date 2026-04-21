'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const [prefs, setPrefs] = useState({
    skinType: '',
    hairType: '',
    primaryGoal: ''
  });

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const meta = user.user_metadata || {};
      setPrefs({
        skinType: meta.skinType || '',
        hairType: meta.hairType || '',
        primaryGoal: meta.primaryGoal || ''
      });
      setLoading(false);
    }
    loadUser();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          skinType: prefs.skinType,
          hairType: prefs.hairType,
          primaryGoal: prefs.primaryGoal
        }
      });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh(); // so that server components see the update
    } catch (err) {
      console.error(err);
      alert("Could not update preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-purple-primary"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF5FF] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/journey" className="inline-flex items-center gap-2 text-text-secondary hover:text-purple-primary transition-colors font-medium text-sm">
           <ArrowLeft className="w-4 h-4" /> Back to Journey
        </Link>

        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32" />
          
          <h1 className="font-playfair font-bold text-3xl text-purple-primary mb-2 relative z-10">Personalize Your AI</h1>
          <p className="text-text-secondary mb-8 relative z-10">
            Tell us about yourself. Our AI uses this data to give you highly specific, contextual advice just for you!
          </p>

          <form onSubmit={handleSave} className="space-y-6 relative z-10">
            
            {/* Skin Type */}
            <div className="space-y-4">
              <label className="block font-bold text-text-primary text-lg">My Skin Type is...</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Oily', 'Dry', 'Combination', 'Sensitive'].map(val => (
                  <label key={val} className={`border rounded-2xl p-4 text-center cursor-pointer transition-all ${prefs.skinType === val ? 'bg-purple-100 border-purple-primary text-purple-primary font-bold shadow-sm' : 'bg-white border-purple-50 text-text-secondary hover:border-purple-200'}`}>
                    <input type="radio" className="hidden" name="skinType" value={val} checked={prefs.skinType === val} onChange={(e) => setPrefs({...prefs, skinType: e.target.value})} />
                    <span className="text-sm">{val}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hair Type */}
            <div className="space-y-4 pt-4 border-t border-purple-50">
              <label className="block font-bold text-text-primary text-lg">My Hair is...</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Straight', 'Wavy', 'Curly', 'Coily'].map(val => (
                  <label key={val} className={`border rounded-2xl p-4 text-center cursor-pointer transition-all ${prefs.hairType === val ? 'bg-pink-50 border-pink-accent text-pink-accent font-bold shadow-sm' : 'bg-white border-purple-50 text-text-secondary hover:border-pink-200'}`}>
                    <input type="radio" className="hidden" name="hairType" value={val} checked={prefs.hairType === val} onChange={(e) => setPrefs({...prefs, hairType: e.target.value})} />
                    <span className="text-sm">{val}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Area of Focus */}
            <div className="space-y-4 pt-4 border-t border-purple-50">
              <label className="block font-bold text-text-primary text-lg">Right now, I am focusing most on...</label>
              <select 
                value={prefs.primaryGoal} 
                onChange={(e) => setPrefs({...prefs, primaryGoal: e.target.value})}
                className="w-full bg-[#FAF5FF] border border-purple-100 focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 rounded-2xl py-4 px-4 outline-none transition-all text-text-primary cursor-pointer"
              >
                <option value="">Select your priority...</option>
                <option value="Clear Skin & Glow Up">Clear Skin & Glow Up</option>
                <option value="Mental Health & Healing">Mental Health & Healing</option>
                <option value="Career Growth & Confidence">Career Growth & Confidence</option>
                <option value="Healthy Relationships">Healthy Relationships</option>
                <option value="Fitness & Nutrition">Fitness & Nutrition</option>
              </select>
            </div>

            <div className="pt-8 flex items-center justify-between">
              {success ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-5 h-5" /> Saved!
                </div>
              ) : <div />}
              
              <button 
                type="submit" 
                disabled={saving}
                className="bg-purple-primary hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
