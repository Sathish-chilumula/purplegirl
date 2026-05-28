import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Starting database cleanup for AI intros...");
  
  // We'll fetch articles that have the "Imagine you" pattern.
  // Using a broad ilike search.
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, slug, intro')
    .ilike('intro', 'Imagine %');

  if (error) {
    console.error("Error fetching articles:", error);
    return;
  }

  console.log(`Found ${articles.length} articles matching the "Imagine..." pattern.`);

  let updatedCount = 0;

  for (const article of articles) {
    if (!article.intro) continue;

    // Regex to remove the first sentence that starts with "Imagine "
    // e.g. "Imagine you're in Mumbai. It's late..." -> "It's late..."
    // Matches "Imagine " followed by anything up to the first period/question mark/exclamation point, plus optional whitespace.
    let newIntro = article.intro.replace(/^Imagine [^.!?]+[.!?]\s*/i, '');
    
    // If the regex wiped everything (i.e. the intro was only one sentence), 
    // or if it didn't change anything, we skip it.
    if (newIntro === article.intro || newIntro.trim().length < 10) {
      continue;
    }

    const { error: updateError } = await supabase
      .from('articles')
      .update({ intro: newIntro })
      .eq('id', article.id);

    if (updateError) {
      console.error(`Error updating article ${article.slug}:`, updateError.message);
    } else {
      updatedCount++;
      if (updatedCount % 50 === 0) {
        console.log(`Updated ${updatedCount} articles so far...`);
      }
    }
  }

  console.log(`\nCleanup complete! Successfully stripped AI footprint from ${updatedCount} articles.`);
  console.log(`URL slugs were NOT touched.`);
}

run();
