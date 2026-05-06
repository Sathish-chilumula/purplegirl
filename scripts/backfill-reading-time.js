import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backfillReadingTime() {
  console.log("Fetching all articles...");
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, content_json, intro, expert_tip, reading_time_mins');

  if (error) {
    console.error("Error fetching articles:", error);
    return;
  }

  console.log(`Found ${articles.length} articles.`);
  
  let updatedCount = 0;

  for (const article of articles) {
    // Only update if it's 5 (the old hardcoded default) or null
    if (!article.reading_time_mins || article.reading_time_mins === 5 || article.reading_time_mins === 6) {
      const contentText = JSON.stringify(article.content_json) + ' ' + (article.intro || '') + ' ' + (article.expert_tip || '');
      const wordCount = contentText.split(/\s+/).length;
      const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200));

      if (readingTimeMins !== article.reading_time_mins) {
        console.log(`Updating ${article.slug}: ${article.reading_time_mins} -> ${readingTimeMins} mins (${wordCount} words)`);
        
        await supabase
          .from('articles')
          .update({ reading_time_mins: readingTimeMins })
          .eq('id', article.id);
          
        updatedCount++;
      }
    }
  }

  console.log(`\nFinished! Updated ${updatedCount} articles.`);
}

backfillReadingTime();
