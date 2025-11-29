import React from 'react';
import { Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { ChatMessage } from '../ArcadeGameApp';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isPlayer = message.sender === 'player';
  const isLLM = message.sender === 'llm';

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isPlayer ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] p-3 ${
          isPlayer
            ? 'bg-neon-blue/20 border-2 border-neon-blue text-neon-blue'
            : isLLM
            ? 'bg-neon-purple/20 border-2 border-neon-purple text-neon-purple'
            : 'bg-gray-600/20 border-2 border-gray-500 text-gray-300'
        } pixel-border`}
      >
        {/* Sender Label */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${
            isPlayer ? 'bg-neon-blue' : isLLM ? 'bg-neon-purple' : 'bg-gray-500'
          }`} />
          <Text className="font-mono text-xs uppercase">
            {message.sender === 'player' ? 'PLAYER' : 'AI ASSISTANT'}
          </Text>
          <Text className="font-body text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </Text>
        </div>

        {/* Message Content */}
        <Text className="font-body text-sm leading-relaxed whitespace-pre-wrap">
          {isLLM && message.content.includes('CONGRATULATIONS') ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-neon-pink font-bold"
            >
              {message.content}
            </motion.span>
          ) : (
            message.content
          )}
        </Text>

        {/* Special effects for success messages */}
        {isLLM && message.content.includes('CONGRATULATIONS') && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="mt-2 text-center"
          >
            <span className="text-2xl">🎉</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
