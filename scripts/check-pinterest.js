require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function checkPinterest() {
  const token = process.env.PINTEREST_ACCESS_TOKEN;

  if (!token) {
    console.error('PINTEREST_ACCESS_TOKEN is missing');
    return;
  }

  console.log('Checking Pinterest Access Token...');

  try {
    // 1. Get user account info
    const userResponse = await axios.get('https://api.pinterest.com/v5/user_account', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Successfully connected to Pinterest!');
    console.log(`Account Name: ${userResponse.data.username}`);

    // 2. List boards
    console.log('\nFetching your boards...');
    const boardsResponse = await axios.get('https://api.pinterest.com/v5/boards', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const boards = boardsResponse.data.items;
    if (boards && boards.length > 0) {
      console.log('Available Boards:');
      boards.forEach(board => {
        console.log(`- ${board.name} (ID: ${board.id})`);
      });
    } else {
      console.log('No boards found. You need at least one board to post pins.');
    }

  } catch (error) {
    console.error('Pinterest API Error:', error.response ? error.response.data : error.message);
  }
}

checkPinterest();
