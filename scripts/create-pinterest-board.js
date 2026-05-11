require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function createBoard() {
  const token = process.env.PINTEREST_ACCESS_TOKEN;

  if (!token) {
    console.error('PINTEREST_ACCESS_TOKEN is missing');
    return;
  }

  const boardName = "Women's Wellness & Health";
  const boardDescription = "Tips, guides, and advice on women's health, relationships, and wellness from purplegirl.in";

  console.log(`Creating new Pinterest board: "${boardName}"...`);

  try {
    const response = await axios.post('https://api.pinterest.com/v5/boards', {
      name: boardName,
      description: boardDescription,
      privacy: "PUBLIC"
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Successfully created board!');
    console.log(`Board Name: ${response.data.name}`);
    console.log(`Board ID: ${response.data.id}`);
    
    console.log('\n--- IMPORTANT ---');
    console.log(`Add this to your .env.local:`);
    console.log(`PINTEREST_BOARD_ID=${response.data.id}`);

  } catch (error) {
    console.error('Error creating board:', error.response ? error.response.data : error.message);
  }
}

createBoard();
