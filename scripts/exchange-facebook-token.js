require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const appId = process.env.FACEBOOK_APP_ID;
const appSecret = process.env.FACEBOOK_APP_SECRET;
const pageId = process.env.FACEBOOK_PAGE_ID;

// Paste the short-lived User Access Token you got from the Graph API Explorer here:
const shortLivedToken = process.argv[2]; 

if (!appId || !appSecret || !pageId) {
  console.error("Missing FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, or FACEBOOK_PAGE_ID in .env.local");
  process.exit(1);
}

if (!shortLivedToken) {
  console.error("Please provide your short-lived User Access Token from Graph API Explorer.");
  console.error("Example: node scripts/exchange-facebook-token.js YOUR_TOKEN_HERE");
  process.exit(1);
}

async function exchange() {
  try {
    console.log("1. Exchanging short-lived User Access Token for long-lived (60 days) User Access Token...");
    const url = `https://graph.facebook.com/v20.0/oauth/access_token` + 
                `?grant_type=fb_exchange_token` + 
                `&client_id=${appId}` + 
                `&client_secret=${appSecret}` + 
                `&fb_exchange_token=${shortLivedToken}`;
                
    const userTokenRes = await axios.get(url);
    const longLivedUserToken = userTokenRes.data.access_token;
    console.log("✅ Successfully got long-lived User Token!");

    console.log("\n2. Requesting permanent Page Access Token using long-lived User Token...");
    const pagesUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${longLivedUserToken}`;
    const pagesRes = await axios.get(pagesUrl);
    const pages = pagesRes.data.data;

    const purpleGirlPage = pages.find(p => p.id === pageId);
    if (!purpleGirlPage) {
      console.error(`\n❌ Error: Could not find a page with ID '${pageId}' associated with your account.`);
      console.log("Available pages in your token:");
      pages.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
      return;
    }

    console.log("\n=========================================================================");
    console.log(`🎉 SUCCESS! Here is your permanent Page Access Token for '${purpleGirlPage.name}':\n`);
    console.log(purpleGirlPage.access_token);
    console.log("\n=========================================================================");
    console.log("⚠️ Copy the Page Access Token above and save it in:");
    console.log("1. Your .env.local as: FACEBOOK_PAGE_ACCESS_TOKEN");
    console.log("2. Your GitHub Secrets as: FACEBOOK_PAGE_ACCESS_TOKEN");
    console.log("=========================================================================");
    
  } catch (error) {
    console.error("\n❌ Error exchanging token:", error.response ? error.response.data : error.message);
  }
}

exchange();
