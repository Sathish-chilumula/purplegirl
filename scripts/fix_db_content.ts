import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DRY_RUN = false; // Execute the updates

async function main() {
  console.log(`Starting script... DRY_RUN is ${DRY_RUN}`);
  
  // 1. BACKUP
  console.log("Fetching all articles for backup...");
  const { data: articles, error } = await supabase.from('articles').select('*');
  
  if (error) {
    console.error("Error fetching articles:", error);
    process.exit(1);
  }
  
  const backupPath = path.resolve(__dirname, '../backup_articles_pre_fix.json');
  fs.writeFileSync(backupPath, JSON.stringify(articles, null, 2));
  console.log(`Backed up ${articles.length} articles to ${backupPath}`);

  // Fetch all active slugs for broken link audit
  const activeSlugs = new Set(articles.map((a: any) => a.slug));
  
  let updatedCount = 0;
  
  for (const article of articles) {
    let needsUpdate = false;
    const updates: any = {};
    
    // Check Intro
    if (article.intro) {
      let newIntro = article.intro;
      if (newIntro.includes("Take the case of Rohini")) {
        newIntro = newIntro.replace(/Take the case of Rohini.*?Bangalore/g, "A woman from Bangalore asked us");
      }
      if (newIntro.includes("discrimates")) {
        newIntro = newIntro.replace(/discrimates/g, "discriminates");
      }
      if (newIntro !== article.intro) {
        updates.intro = newIntro;
        needsUpdate = true;
      }
    }
    
    // Check Content JSON
    if (article.content_json) {
      let contentJsonString = JSON.stringify(article.content_json);
      const originalContentString = contentJsonString;
      
      // Fix typos
      if (contentJsonString.includes("discrimates")) {
        contentJsonString = contentJsonString.replace(/discrimates/g, "discriminates");
      }
      
      // Parse to fix structure
      let content = JSON.parse(contentJsonString);
      
      // Normalize Step Numbering
      if (content.steps && Array.isArray(content.steps)) {
        let internalLinksKept = 0;
        
        for (let i = 0; i < content.steps.length; i++) {
          const step = content.steps[i];
          
          // Remove "Step X:" or "Step X -" from headline
          if (step.headline) {
            step.headline = step.headline.replace(/^Step\s+\d+[:\-\.]?\s*/i, "");
          }
          
          // Reduce internal link stuffing
          if (step.body) {
            const linkRegex = /<a[^>]*href="(\/how-to\/[^"]+)"[^>]*>(.*?)<\/a>/gi;
            step.body = step.body.replace(linkRegex, (match: string, p1: string, p2: string) => {
              // Broken link audit
              const linkSlug = p1.replace("/how-to/", "").split("#")[0]; // remove hash if any
              if (!activeSlugs.has(linkSlug)) {
                console.log(`[Broken Link Found in ${article.slug}]: ${p1}`);
                return p2; // Strip the broken link, leave text
              }
              
              if (internalLinksKept < 2) {
                internalLinksKept++;
                return match; // Keep link
              } else {
                return p2; // Strip link, leave text
              }
            });
          }
        }
      }
      
      // Disclaimer Audit: Ensure "Community Advice Disclaimer" isn't hardcoded in JSON
      if (JSON.stringify(content).includes("Community Advice Disclaimer")) {
        for (let i = 0; i < content.steps?.length; i++) {
          const step = content.steps[i];
          if (step.body && step.body.includes("Community Advice Disclaimer")) {
            // Replaces the whole sentence or just strip it
            step.body = step.body.replace(/Community Advice Disclaimer:.*?(<\/p>|<br>|\n|$)/gi, "");
          }
        }
      }
      
      if (JSON.stringify(content) !== originalContentString) {
        updates.content_json = content;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      if (DRY_RUN) {
        console.log(`[DRY RUN] Would update article: ${article.slug}`);
      } else {
        const { error: updateError } = await supabase
          .from('articles')
          .update(updates)
          .eq('id', article.id);
          
        if (updateError) {
          console.error(`Error updating article ${article.slug}:`, updateError);
        } else {
          console.log(`Updated article: ${article.slug}`);
        }
      }
      updatedCount++;
    }
  }
  
  console.log(`Finished processing. ${DRY_RUN ? 'Would update' : 'Updated'} ${updatedCount} articles.`);
}

main().catch(console.error);
