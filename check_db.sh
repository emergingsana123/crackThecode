#!/bin/bash

# SpacetimeDB Table Check Script
# This script runs SQL queries to inspect all tables in the hophacks-chat database

echo "🔍 Checking SpacetimeDB Tables for hophacks-chat module..."
echo "=============================================="

# Check if spacetime CLI is available
if ! command -v spacetime &> /dev/null; then
    echo "❌ SpacetimeDB CLI not found. Please install it first."
    echo "   Visit: https://spacetimedb.com/docs/install"
    exit 1
fi

# Database connection details
MODULE_NAME="hophacks-chat"
HOST="localhost:3000"

echo "📊 Connecting to SpacetimeDB at $HOST..."
echo "📦 Module: $MODULE_NAME"
echo ""

# Function to run a SQL query
run_query() {
    local query="$1"
    local description="$2"
    
    echo "🔎 $description"
    echo "Query: $query"
    echo "Result:"
    spacetime sql "$MODULE_NAME" "$query" 2>/dev/null || echo "❌ Query failed or table empty"
    echo ""
}

# Individual table checks
echo "=== INDIVIDUAL TABLE INSPECTION ==="

run_query "SELECT * FROM AiReplies LIMIT 5;" "AiReplies Table (first 5 rows)"
run_query "SELECT COUNT(*) as count FROM AiReplies;" "AiReplies Count"

run_query "SELECT * FROM GameResult LIMIT 5;" "GameResult Table (first 5 rows)"
run_query "SELECT COUNT(*) as count FROM GameResult;" "GameResult Count"

run_query "SELECT * FROM GameRooms LIMIT 5;" "GameRooms Table (first 5 rows)"
run_query "SELECT COUNT(*) as count FROM GameRooms;" "GameRooms Count"

run_query "SELECT * FROM Leaderboard ORDER BY score DESC LIMIT 5;" "Leaderboard Top 5"
run_query "SELECT COUNT(*) as count FROM Leaderboard;" "Leaderboard Count"

run_query "SELECT * FROM Messages ORDER BY timestamp DESC LIMIT 5;" "Messages (latest 5)"
run_query "SELECT COUNT(*) as count FROM Messages;" "Messages Count"

run_query "SELECT * FROM RoomPlayers LIMIT 5;" "RoomPlayers Table (first 5 rows)"
run_query "SELECT COUNT(*) as count FROM RoomPlayers;" "RoomPlayers Count"

run_query "SELECT * FROM RoomTemplate LIMIT 5;" "RoomTemplate Table (first 5 rows)"
run_query "SELECT COUNT(*) as count FROM RoomTemplate;" "RoomTemplate Count"

run_query "SELECT * FROM Users LIMIT 5;" "Users Table (first 5 rows)"
run_query "SELECT COUNT(*) as count FROM Users;" "Users Count"

echo "=== DATABASE SUMMARY ==="
run_query "SELECT 
  (SELECT COUNT(*) FROM AiReplies) as ai_replies,
  (SELECT COUNT(*) FROM GameResult) as game_results,
  (SELECT COUNT(*) FROM GameRooms) as game_rooms,
  (SELECT COUNT(*) FROM Leaderboard) as leaderboard_entries,
  (SELECT COUNT(*) FROM Messages) as messages,
  (SELECT COUNT(*) FROM RoomPlayers) as room_players,
  (SELECT COUNT(*) FROM RoomTemplate) as room_templates,
  (SELECT COUNT(*) FROM Users) as users;" "Complete Database Summary"

echo "✅ Database inspection complete!"
echo ""
echo "💡 Tips:"
echo "   - If tables are empty, the React app might not be connected to SpacetimeDB"
echo "   - Check if reducers are being called in the frontend"
echo "   - Verify SpacetimeDB server is running on localhost:3000"
