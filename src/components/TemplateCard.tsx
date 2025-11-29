import React from 'react';
import { motion } from 'framer-motion';
import { Card, Text, Badge, Button, Group } from '@mantine/core';
import { IconBolt, IconShield, IconSkull } from '@tabler/icons-react';
import { Template } from '../ArcadeGameApp';

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <IconBolt size={16} className="text-green-400" />;
      case 'medium':
        return <IconShield size={16} className="text-orange-400" />;
      case 'hard':
        return <IconSkull size={16} className="text-red-400" />;
      default:
        return <IconBolt size={16} className="text-green-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'border-green-400 text-green-400';
      case 'medium':
        return 'border-orange-400 text-orange-400';
      case 'hard':
        return 'border-red-400 text-red-400';
      default:
        return 'border-green-400 text-green-400';
    }
  };

  const isCustom = template.createdBy !== 'system';

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        rotate: 1
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <Card
        className={`
          bg-dark-surface border-2 transition-all duration-300 cursor-pointer glow-hover
          ${isCustom ? 'border-neon-purple' : 'border-neon-blue'}
        `}
        onClick={onSelect}
        style={{
          backgroundImage: `linear-gradient(135deg, transparent 40%, ${isCustom ? 'rgba(142, 68, 255, 0.05)' : 'rgba(0, 212, 255, 0.05)'} 100%)`,
        }}
      >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`
            w-16 h-16 rounded-none border-2 flex items-center justify-center text-2xl
            ${isCustom ? 'border-neon-purple bg-dark-bg' : 'border-neon-blue bg-dark-bg'}
          `}>
            {template.iconUrl}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Text className="font-heading text-lg text-neon-blue truncate">
              {template.name}
            </Text>
            {isCustom && (
              <Badge size="xs" className="bg-neon-purple text-dark-bg font-body">
                CUSTOM
              </Badge>
            )}
          </div>
          
          <Text className="font-body text-sm text-gray-300 mb-3 line-clamp-2">
            {template.tagline}
          </Text>

          <Group justify="space-between" align="center">
            <Badge
              variant="outline"
              size="sm"
              className={`font-body ${getDifficultyColor(template.difficulty)} bg-transparent`}
              leftSection={getDifficultyIcon(template.difficulty)}
            >
              {template.difficulty.toUpperCase()}
            </Badge>

            <Button
              size="xs"
              className="arcade-button text-xs px-3 py-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              ENTER
            </Button>
          </Group>
        </div>
      </div>

      {/* Animated border effect */}
      <div className={`
        absolute inset-0 border-2 border-transparent transition-all duration-300
        ${isCustom ? 'hover:border-neon-purple' : 'hover:border-neon-pink'}
      `} style={{
        background: `linear-gradient(45deg, transparent, ${isCustom ? '#8E44FF' : '#ff0080'}20, transparent)`,
        mask: 'linear-gradient(white, white) padding-box, linear-gradient(white, white)',
        maskComposite: 'exclude',
      }} />
    </Card>
    </motion.div>
  );
};

export default TemplateCard;
