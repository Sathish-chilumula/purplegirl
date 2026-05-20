require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

// You must add PINTEREST_APP_ID to your .env.local file!
const appId = process.env.PINTEREST_APP_ID;
const appSecret = process.env.PINTEREST_APP_SECRET;

// Paste the code you got from the browser URL here:
const authCode = process.argv[2]; 

if (!appId || !appSecret) {
  console.error("Missing PINTEREST_APP_ID or PINTEREST_APP_SECRET in .env.local");
  process.exit(1);
}

if (!authCode) {
  console.error("Please provide the authorization code. Example: node scripts/exchange-token.js YOUR_CODE_HERE");
  process.exit(1);
}

async function exchangeToken() {
  const credentials = Buffer.from(`${appId}:${appSecret}`).toString('base64');
  
  try {
    const response = await axios.post('https://api.pinterest.com/v5/oauth/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: 'https://localhost/'
      }).toString(),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log("✅ SUCCESS! Here is your new Access Token:\n");
    console.log(response.data.access_token);
    console.log("\n⚠️ Save this token in your .env.local as PINTEREST_ACCESS_TOKEN and in GitHub Secrets!");
    
  } catch (error) {
    console.error("❌ Error exchanging token:", error.response ? error.response.data : error.message);
  }
}

exchangeToken();
