import { supabaseAdmin } from '@/lib/supabase-admin';
import AdminActions from './AdminActions';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { data: pendingQuestions } = await supabaseAdmin
    .from('questions')
    .select('*, categories(name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1F1235] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-2">Pending Questions</h3>
          <p className="text-4xl font-bold text-[#7C3AED]">{pendingQuestions?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex justify-between items-center">
          <h2 className="font-bold text-xl text-[#7C3AED]">Pending Review Queue</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {pendingQuestions && pendingQuestions.length > 0 ? pendingQuestions.map((q) => (
            <div key={q.id} className="p-6 transition hover:bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <div className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded w-max mb-3 uppercase tracking-wide">
                    {q.categories?.name}
                  </div>
                  <h3 className="text-xl font-bold text-[#1F1235] mb-2">{q.title}</h3>
                  {q.description && <p className="text-gray-600 mb-4 text-sm">{q.description}</p>}
                  
                  <div className="text-xs text-gray-400 mt-2 font-medium">
                    ID: {q.id} • Asked: {new Date(q.created_at).toLocaleString()}
                  </div>
                </div>
                <AdminActions questionId={q.id} />
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-gray-500 font-medium flex flex-col items-center">
              <span className="text-4xl mb-4">🎉</span>
              No pending questions in the queue! You're fully caught up.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
