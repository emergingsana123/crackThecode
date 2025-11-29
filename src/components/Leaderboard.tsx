import React from 'react';
import { motion } from 'framer-motion';
import { Text, Badge, ScrollArea } from '@mantine/core';
import { IconTrophy, IconClock, IconMessages } from '@tabler/icons-react';
import { LeaderboardEntry } from '../ArcadeGameApp';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  showRoom?: boolean;
  maxHeight?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  entries, 
  showRoom = false, 
  maxHeight = 400 
}) => {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  const getDifficultyColor = (messageCount: number, durationSeconds: number) => {
    // Expert: Few messages AND fast time
    if (messageCount <= 3 && durationSeconds <= 120) return 'text-neon-pink'; // Expert
    // Good: Moderate messages OR decent time
    if (messageCount <= 7 || durationSeconds <= 300) return 'text-neon-purple'; // Good
    return 'text-neon-blue'; // Beginner
  };

  const getDifficultyLabel = (messageCount: number, durationSeconds: number) => {
    if (messageCount <= 3 && durationSeconds <= 120) return 'EXPERT';
    if (messageCount <= 7 || durationSeconds <= 300) return 'SKILLED';
    return 'ROOKIE';
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-yellow-400 text-xl">🥇</span>;
      case 1:
        return <span className="text-gray-400 text-xl">🥈</span>;
      case 2:
        return <span className="text-orange-400 text-xl">🥉</span>;
      default:
        return <span className="text-neon-blue font-heading text-sm">#{index + 1}</span>;
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <IconTrophy size={48} className="text-neon-blue mx-auto mb-4 opacity-50" />
        <Text className="font-body text-lg text-gray-400">
          NO ENTRIES YET
        </Text>
        <Text className="font-body text-sm text-gray-500 mt-2">
          Be the first to crack a code!
        </Text>
      </div>
    );
  }

  return (
    <ScrollArea h={maxHeight} className="pixel-border bg-dark-bg p-2">
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={`${entry.timestamp}-${entry.messageCount}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              flex items-center gap-3 p-3 rounded-none border-2 transition-all duration-200 glow-hover
              ${index === 0 ? 'border-yellow-400 bg-yellow-400/10' : 
                index === 1 ? 'border-gray-300 bg-gray-300/10' : 
                index === 2 ? 'border-orange-400 bg-orange-400/10' : 
                'border-neon-blue bg-neon-blue/5'
              }
            `}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-10 text-center">
              {getRankIcon(index)}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Text className="font-mono text-sm text-neon-blue truncate">
                  {entry.playerName.toUpperCase()}
                </Text>
                <Badge 
                  size="xs" 
                  className={`
                    font-body text-xs px-2 py-1 border
                    ${getDifficultyColor(entry.messageCount, entry.durationSeconds)} 
                    ${entry.messageCount <= 3 && entry.durationSeconds <= 120 ? 'border-neon-pink' : 
                      entry.messageCount <= 7 || entry.durationSeconds <= 300 ? 'border-neon-purple' : 'border-neon-blue'}
                    bg-transparent
                  `}
                >
                  {getDifficultyLabel(entry.messageCount, entry.durationSeconds)}
                </Badge>
              </div>

              {showRoom && (
                <Text className="font-body text-xs text-gray-400 truncate">
                  📍 {entry.roomName}
                </Text>
              )}
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-1 mb-1">
                <IconMessages size={12} className="text-neon-purple" />
                <Text className="font-body text-xs text-neon-purple">
                  {entry.messageCount}
                </Text>
              </div>
              <div className="flex items-center gap-1">
                <IconClock size={12} className="text-gray-400" />
                <Text className="font-body text-xs text-gray-400">
                  {formatDuration(entry.durationSeconds)}
                </Text>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Leaderboard;
