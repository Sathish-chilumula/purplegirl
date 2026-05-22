const https = require('https');

const sitemapUrl = 'https://purplegirl.in/sitemap.xml';

// Google deprecated the ping endpoint in late 2023, but some still use it just in case.
// The best way for Google is configuring Search Console or Indexing API.
const searchEngines = [
  `https://www.google.com/ping?sitemap=${sitemapUrl}`,
  `https://www.bing.com/ping?sitemap=${sitemapUrl}`
];

console.log(`Starting to ping search engines for ${sitemapUrl}...`);

searchEngines.forEach(url => {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ Successfully submitted to ${new URL(url).hostname}`);
    } else {
      console.log(`❌ Failed to submit to ${new URL(url).hostname} (Status: ${res.statusCode})`);
    }
  }).on('error', (err) => {
    console.error(`❌ Error submitting to ${new URL(url).hostname}:`, err.message);
  });
});
