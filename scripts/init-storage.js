require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initStorage() {
  const bucketName = 'social_assets';

  console.log(`Checking for bucket: ${bucketName}...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const exists = buckets.find(b => b.name === bucketName);

  if (!exists) {
    console.log(`Bucket ${bucketName} not found. Creating...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error('Error creating bucket:', error);
    } else {
      console.log(`Successfully created public bucket: ${bucketName}`);
    }
  } else {
    console.log(`Bucket ${bucketName} already exists.`);
  }
}

initStorage();
