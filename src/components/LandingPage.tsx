import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Container, 
  Grid, 
  Title, 
  Text, 
  Button, 
  Modal, 
  TextInput, 
  Group,
  Card,
  Badge,
  Select,
} from '@mantine/core';
import { IconPlus, IconTrophy, IconClock, IconMessages } from '@tabler/icons-react';
import { Template, LeaderboardEntry } from '../ArcadeGameApp';
import Leaderboard from './Leaderboard';
import TemplateCard from './TemplateCard';

interface LandingPageProps {
  templates: Template[];
  leaderboard: LeaderboardEntry[];
  onEnterRoom: (template: Template) => void;
  onAddTemplate: (template: Template) => void;
  playerName: string;
  onSetPlayerName: (name: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  templates,
  leaderboard,
  onEnterRoom,
  onAddTemplate,
  playerName,
  onSetPlayerName,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    tagline: '',
    secretCode: '',
    iconUrl: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });
  const [nameModalOpen, setNameModalOpen] = useState(!playerName);

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.tagline && newTemplate.secretCode) {
      const template: Template = {
        id: `custom-${Date.now()}`,
        name: newTemplate.name.toUpperCase(),
        tagline: newTemplate.tagline,
        secretCode: newTemplate.secretCode,
        iconUrl: newTemplate.iconUrl || '🎯',
        published: true,
        createdBy: playerName || 'Anonymous',
        difficulty: newTemplate.difficulty,
      };
      
      onAddTemplate(template);
      setCreateModalOpen(false);
      setNewTemplate({
        name: '',
        tagline: '',
        secretCode: '',
        iconUrl: '',
        difficulty: 'medium',
      });
    }
  };

  const handleSetName = () => {
    if (playerName.trim()) {
      setNameModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 243, 255, 0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <Container size="xl" className="relative z-10 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title 
            order={1} 
            className="font-title text-6xl md:text-8xl text-neon-blue mb-4 typewriter-text"
            style={{ animationDelay: '0.5s', color: '#333333' }}
          >
            CRACK THE CODE
          </Title>
          <Text 
            size="xl" 
            className="font-body text-2xl text-neon-purple"
            style={{ animationDelay: '2s', color: '#666666' }}
          >
            Your playful challenge — crack the code!
          </Text>
          
          {playerName && (
            <Badge 
              size="lg" 
              className="mt-4 bg-white border-3 border-neon-pink text-neon-pink font-body"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)'
              }}
            >
              PLAYER: {playerName.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Main Content Grid */}
        <Grid gutter="xl">
          {/* Left Side - Leaderboard */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2, 
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
              className="h-full"
            >
              <Card className="retro-card neon-glow-purple h-full glow-hover-purple">
                <div className="flex items-center gap-3 mb-6">
                  <IconTrophy size={32} className="text-neon-purple" />
                  <Title order={2} className="font-heading text-2xl text-neon-purple">
                    GLOBAL LEADERBOARD
                  </Title>
                </div>
                <Leaderboard entries={leaderboard} showRoom={true} />
              </Card>
            </motion.div>
          </Grid.Col>

          {/* Right Side - Templates */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4, 
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
              className="h-full"
            >
              <Card className="retro-card neon-glow h-full glow-hover">
                <div className="flex items-center justify-between mb-6">
                                  <Title order={2} className="font-heading text-2xl text-neon-blue">
                    ATTACK SCENARIOS
                  </Title>
                  <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="arcade-button"
                    leftSection={<IconPlus size={16} />}
                  >
                    CREATE CUSTOM
                  </Button>
                </div>

                <div className="space-y-4">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={() => onEnterRoom(template)}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          </Grid.Col>
        </Grid>

        {/* Stats Section */}
        <div className="mt-12">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.6,
                  type: "spring",
                  stiffness: 120,
                  damping: 8
                }}
              >
                <Card className="bg-dark-surface border-2 border-neon-blue text-center p-6 glow-hover">
                  <IconMessages size={48} className="text-neon-blue mx-auto mb-2" />
                  <Text className="font-heading text-lg text-neon-blue">
                    ACTIVE ROOMS
                  </Text>
                  <Text className="font-mono-bold text-2xl text-white">
                    {templates.filter(t => t.published).length}
                  </Text>
                </Card>
              </motion.div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.7,
                  type: "spring",
                  stiffness: 120,
                  damping: 8
                }}
              >
                <Card className="bg-dark-surface border-2 border-neon-purple text-center p-6 glow-hover-purple">
                  <IconTrophy size={48} className="text-neon-purple mx-auto mb-2" />
                  <Text className="font-heading text-lg text-neon-purple">
                    TOTAL CRACKS
                  </Text>
                  <Text className="font-mono-bold text-2xl text-white">
                    {leaderboard.length}
                  </Text>
                </Card>
              </motion.div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8,
                  type: "spring",
                  stiffness: 120,
                  damping: 8
                }}
              >
                <Card className="bg-dark-surface border-2 border-neon-pink text-center p-6 glow-hover">
                  <IconClock size={48} className="text-neon-pink mx-auto mb-2" />
                  <Text className="font-heading text-lg text-neon-pink">
                    BEST TIME
                  </Text>
                  <Text className="font-mono-bold text-2xl text-white">
                    {leaderboard.length > 0 
                    ? `${Math.min(...leaderboard.map(e => e.durationSeconds))}s`
                    : '--'
                  }
                  </Text>
                </Card>
              </motion.div>
            </Grid.Col>
          </Grid>
        </div>
      </Container>

      {/* Player Name Modal */}
      <Modal
        opened={nameModalOpen}
        onClose={() => {}}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        title={
          <Text className="font-heading text-xl text-neon-pink">
            ENTER PLAYER NAME
          </Text>
        }
        className="bg-dark-surface border-3 border-neon-pink"
      >
        <div className="space-y-4">
          <TextInput
            placeholder="Your hacker alias..."
            value={playerName}
            onChange={(e) => onSetPlayerName(e.target.value)}
            className="font-body"
            onKeyPress={(e) => e.key === 'Enter' && handleSetName()}
          />
          <Button 
            onClick={handleSetName}
            disabled={!playerName.trim()}
            className="arcade-button w-full"
          >
            ENTER THE GAME
          </Button>
        </div>
      </Modal>

      {/* Create Template Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={
          <Text className="font-heading text-xl text-neon-pink">
            CREATE CUSTOM TEMPLATE
          </Text>
        }
        size="lg"
        className="bg-dark-surface border-3 border-neon-pink"
      >
        <div className="space-y-4">
          <TextInput
            label="Template Name"
            placeholder="e.g., QUANTUM BANK"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
            className="font-body"
          />
          
          <TextInput
            label="Theme/Tagline"
            placeholder="e.g., Break into the quantum vault"
            value={newTemplate.tagline}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, tagline: e.target.value }))}
            className="font-body"
          />
          
          <TextInput
            label="Secret Code"
            placeholder="The code players must discover"
            value={newTemplate.secretCode}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, secretCode: e.target.value }))}
            className="font-body"
          />
          
          <TextInput
            label="Icon (emoji or URL)"
            placeholder="🏦 or https://..."
            value={newTemplate.iconUrl}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, iconUrl: e.target.value }))}
            className="font-body"
          />

          <Select
            label="Difficulty Level"
            placeholder="Select difficulty"
            value={newTemplate.difficulty}
            onChange={(value) => setNewTemplate(prev => ({ ...prev, difficulty: value as 'easy' | 'medium' | 'hard' }))}
            data={[
              { value: 'easy', label: '🟢 EASY - Basic challenges' },
              { value: 'medium', label: '🟡 MEDIUM - Moderate difficulty' },
              { value: 'hard', label: '🔴 HARD - Expert level' },
            ]}
            className="font-body"
          />

          <Group justify="space-between" mt="xl">
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              className="border-neon-blue text-neon-blue"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              className="arcade-button"
              disabled={!newTemplate.name || !newTemplate.tagline || !newTemplate.secretCode}
            >
              PUBLISH TEMPLATE
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
