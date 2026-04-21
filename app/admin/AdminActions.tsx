'use client';
import { CheckCircle2, Trash2, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminActions({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: 'approved' | 'rejected' | 'featured') => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, status })
      });
      if (!res.ok) throw new Error('API Error');
      
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
      <button 
        disabled={loading}
        onClick={() => handleAction('approved')}
        className="flex justify-center items-center gap-2 bg-[#4CAF50] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
        Approve
      </button>
      
      <button 
        disabled={loading}
        onClick={() => handleAction('featured')}
        className="flex justify-center items-center gap-2 bg-[#7C3AED] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} 
        Feature
      </button>

      <button 
        disabled={loading}
        onClick={() => handleAction('rejected')}
        className="flex justify-center items-center gap-2 bg-gray-100 text-gray-700 hover:text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} 
        Reject
      </button>
    </div>
  );
}
