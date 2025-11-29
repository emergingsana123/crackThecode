const { execSync } = require('child_process');

// SpacetimeDB Table Inspector
// This script uses the spacetime CLI to check all tables

console.log('🔍 SpacetimeDB Table Inspector');
console.log('=====================================');

const MODULE_NAME = 'hophacks-chat';
const tables = [
  'AiReplies',
  'GameResult', 
  'GameRooms',
  'Leaderboard',
  'Messages',
  'RoomPlayers',
  'RoomTemplate',
  'Users'
];

function runQuery(query, description) {
  console.log(`\n🔎 ${description}`);
  console.log(`Query: ${query}`);
  console.log('Result:');
  
  try {
    const result = execSync(`spacetime sql ${MODULE_NAME} "${query}"`, { 
      encoding: 'utf-8',
      timeout: 5000 
    });
    console.log(result || '(No data returned)');
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Check if spacetime CLI is available
try {
  execSync('spacetime --version', { stdio: 'pipe' });
  console.log('✅ SpacetimeDB CLI found');
} catch (error) {
  console.log('❌ SpacetimeDB CLI not found. Please install it first.');
  console.log('   Visit: https://spacetimedb.com/docs/install');
  process.exit(1);
}

console.log(`\n📦 Checking module: ${MODULE_NAME}`);

// Check each table
tables.forEach(table => {
  console.log(`\n=== ${table.toUpperCase()} TABLE ===`);
  
  // Get table structure/schema
  runQuery(`DESCRIBE ${table}`, `${table} Schema`);
  
  // Count rows
  runQuery(`SELECT COUNT(*) as count FROM ${table}`, `${table} Row Count`);
  
  // Get sample data (first 3 rows)
  runQuery(`SELECT * FROM ${table} LIMIT 3`, `${table} Sample Data`);
});

// Summary
console.log('\n=== DATABASE SUMMARY ===');
const summaryQuery = tables.map(table => 
  `(SELECT COUNT(*) FROM ${table}) as ${table.toLowerCase()}_count`
).join(', ');

runQuery(`SELECT ${summaryQuery}`, 'Complete Row Counts');

// Recent activity
console.log('\n=== RECENT ACTIVITY ===');
runQuery('SELECT * FROM Messages ORDER BY timestamp DESC LIMIT 5', 'Latest Messages');
runQuery('SELECT * FROM Leaderboard ORDER BY score DESC LIMIT 5', 'Top Leaderboard');

console.log('\n✅ Table inspection complete!');
