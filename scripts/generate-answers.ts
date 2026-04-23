import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Fetch up to 50 pending questions for daily run
  const { data: pending, error } = await supabase
    .from('questions')
    .select('id')
    .eq('status', 'pending')
    .limit(50);
    
  if (error || !pending || pending.length === 0) {
    console.log('No pending questions found or error fetching.');
    return;
  }
  
  console.log(`Processing ${pending.length} pending questions...`);
  
  for (const q of pending) {
     // Trigger the actual generation logic sitting on your API endpoint
     try {
       const res = await fetch(`${process.env.SITE_URL || 'https://purplegirl.in'}/api/generate-answer`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ questionId: q.id })
       });
       
       if (res.ok) {
         console.log(`Generated answer for ${q.id} (Status: ${res.status})`);
         // Approve them so they appear on site
         await supabase.from('questions').update({ status: 'approved' }).eq('id', q.id);
       } else {
         console.error(`Failed to generate answer for ${q.id}: ${res.status}`);
       }
     } catch (err) {
       console.error(`Failed to generate answer for ${q.id}:`, err);
     }
     
     // Mild throttle to avoid smashing Groq's burst rate limits
     await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('Daily batch complete.');
}

run();
