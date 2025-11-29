import React, { useEffect, useState } from 'react';
import './App.css';
import {
  DbConnection,
  ErrorContext,
  EventContext,
  Messages,
  Users,
  GameRooms,
  RoomTemplate,
  AiReplies,
  Leaderboard,
} from './module_bindings';
import { Identity } from '@clockworklabs/spacetimedb-sdk';

// Game state types
type GameRoom = {
  roomId: string;
  templateId: string;
  createdBy: string;
  isActive: boolean;
  template?: RoomTemplate;
};

type AttackMessage = {
  id: string;
  text: string;
  severity?: number;
  vulnerability?: string;
  aiResponse?: string;
};

// Hooks for real-time data
function useGameRooms(conn: DbConnection | null): GameRoom[] {
  const [rooms, setRooms] = useState<GameRoom[]>([]);

  useEffect(() => {
    if (!conn) return;

    const onInsert = (_ctx: EventContext, room: GameRooms) => {
      const newRoom = {
        roomId: room.roomId,
        templateId: room.templateId,
        createdBy: room.hostId.toHexString(),
        isActive: room.status === 'active',
      };
      
      setRooms(prev => [...prev, newRoom]);
    };

    conn.db.gameRooms.onInsert(onInsert);
    return () => conn.db.gameRooms.removeOnInsert(onInsert);
  }, [conn]);

  return rooms;
}

function useRoomTemplates(conn: DbConnection | null): RoomTemplate[] {
  const [templates, setTemplates] = useState<RoomTemplate[]>([]);

  useEffect(() => {
    if (!conn) return;

    const onInsert = (_ctx: EventContext, template: RoomTemplate) => {
      setTemplates(prev => [...prev, template]);
    };

    conn.db.roomTemplate.onInsert(onInsert);
    return () => conn.db.roomTemplate.removeOnInsert(onInsert);
  }, [conn]);

  return templates;
}

function useMessages(conn: DbConnection | null, roomId: string): AttackMessage[] {
  const [messages, setMessages] = useState<AttackMessage[]>([]);

  useEffect(() => {
    if (!conn || !roomId) return;

    // Load existing messages when room changes
    const loadExistingMessages = () => {
      console.log('🔍 Loading existing messages for room:', roomId);
      const messageMap = new Map<string, AttackMessage>();
      
      // First, add all messages for this room
      let messageCount = 0;
      for (const message of conn.db.messages.iter()) {
        console.log('📄 Found message:', message.id, 'room:', message.roomId, 'target room:', roomId);
        if (message.roomId === roomId) {
          messageCount++;
          messageMap.set(message.id.toString(), {
            id: message.id.toString(),
            text: message.text,
          });
        }
      }
      console.log(`📊 Found ${messageCount} messages for room ${roomId}`);
      
      // Then, add AI replies
      let replyCount = 0;
      for (const reply of conn.db.aiReplies.iter()) {
        const messageId = reply.messageId.toString();
        console.log('🤖 Found AI reply for message:', messageId);
        if (messageMap.has(messageId)) {
          replyCount++;
          const message = messageMap.get(messageId)!;
          message.aiResponse = reply.text;
          message.severity = reply.severityScore;
          message.vulnerability = reply.vulnerabilityTriggered || undefined;
          console.log('✅ Added AI reply to message:', messageId);
        }
      }
      console.log(`📊 Added ${replyCount} AI replies`);
      
      console.log('🏁 Final messages:', Array.from(messageMap.values()));
      setMessages(Array.from(messageMap.values()));
    };

    loadExistingMessages();

    const onInsert = (_ctx: EventContext, message: Messages) => {
      if (message.roomId === roomId) {
        setMessages(prev => [...prev, {
          id: message.id.toString(),
          text: message.text,
        }]);
      }
    };

    const onAiReply = (_ctx: EventContext, reply: AiReplies) => {
      setMessages(prev => prev.map(msg => 
        msg.id === reply.messageId.toString() 
          ? { 
              ...msg, 
              aiResponse: reply.text,
              severity: reply.severityScore,
              vulnerability: reply.vulnerabilityTriggered || undefined
            }
          : msg
      ));
    };

    conn.db.messages.onInsert(onInsert);
    conn.db.aiReplies.onInsert(onAiReply);

    return () => {
      conn.db.messages.removeOnInsert(onInsert);
      conn.db.aiReplies.removeOnInsert(onAiReply);
    };
  }, [conn, roomId]);

  return messages;
}

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connected, setConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [conn, setConn] = useState<DbConnection | null>(null);
  
  // Game state
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [attackText, setAttackText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Real-time data
  const gameRooms = useGameRooms(conn);
  const roomTemplates = useRoomTemplates(conn);
  const messages = useMessages(conn, currentRoom);

  // Initialize SpacetimeDB connection
  useEffect(() => {
    const onConnect = (conn: DbConnection, identity: Identity, token: string) => {
      setIdentity(identity);
      setConnected(true);
      localStorage.setItem('auth_token', token);
      console.log('🔗 Connected to RedTeam Game:', identity.toHexString());
      
      // Subscribe to all game tables
      conn.subscriptionBuilder()
        .onApplied(() => {
          console.log('📡 Game data synchronized');
        })
        .subscribe([
          'SELECT * FROM users',
          'SELECT * FROM room_template', 
          'SELECT * FROM game_rooms',
          'SELECT * FROM messages',
          'SELECT * FROM ai_replies',
          'SELECT * FROM leaderboard'
        ]);
    };

    const onDisconnect = () => {
      console.log('🔌 Disconnected from SpacetimeDB');
      setConnected(false);
    };

    const onConnectError = (_ctx: ErrorContext, err: Error) => {
      console.error('❌ Connection error:', err);
    };

    const connection = DbConnection.builder()
      .withUri('ws://localhost:3000')
      .withModuleName('hophacks-chat')
      .withToken(localStorage.getItem('auth_token') || '')
      .onConnect(onConnect)
      .onDisconnect(onDisconnect)
      .onConnectError(onConnectError)
      .build();

    setConn(connection);

    return () => {
      if (connection) {
        connection.disconnect();
      }
    };
  }, []);

  // Set username
  const handleSetUsername = () => {
    if (!conn || !username.trim()) return;
    
    conn.reducers.setUsername(username);
    setIsLoggedIn(true);
  };

  // Create new game room
  const handleCreateRoom = () => {
    if (!conn || !selectedTemplate) return;
    
    console.log('Creating room with template:', selectedTemplate);
    
    // Set up listener for room creation before calling reducer
    const tempListener = (_ctx: EventContext, room: GameRooms) => {
      if (room.hostId.toHexString() === identity?.toHexString()) {
        console.log('Room created, joining:', room.roomId);
        setCurrentRoom(room.roomId);
        // Join the room we just created
        conn.reducers.joinRoom(room.roomId);
        // Remove the temporary listener
        conn.db.gameRooms.removeOnInsert(tempListener);
      }
    };
    
    conn.db.gameRooms.onInsert(tempListener);
    
    // The reducer expects templateId and maxPlayers
    conn.reducers.createRoom(selectedTemplate, 6);
  };

  // Join existing room
  const handleJoinRoom = (roomId: string) => {
    console.log('🚪 Attempting to join room:', roomId);
    if (!conn) return;
    
    try {
      conn.reducers.joinRoom(roomId);
      setCurrentRoom(roomId);
      console.log('✅ Successfully joined room:', roomId);
    } catch (error) {
      console.error('❌ Failed to join room:', error);
    }
  };

  // Send attack message
  const handleSendAttack = () => {
    if (!conn || !currentRoom || !attackText.trim()) return;
    
    conn.reducers.sendAttackMessage(currentRoom, attackText);
    setAttackText('');
  };

  // Get template details
  const getCurrentTemplate = () => {
    if (!currentRoom) return null;
    const room = gameRooms.find(r => r.roomId === currentRoom);
    if (!room) return null;
    return roomTemplates.find(t => t.id === room.templateId);
  };

  const currentTemplate = getCurrentTemplate();

  if (!connected) {
    return (
      <div className="app">
        <div className="connecting">
          <h1>🛡️ RedTeam Education Platform</h1>
          <p>Connecting to SpacetimeDB...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="login">
          <h1>🛡️ RedTeam Education Platform</h1>
          <p>Learn prompt injection and AI security</p>
          <div className="login-form">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
            />
            <button onClick={handleSetUsername}>Join Game</button>
          </div>
          <div className="identity">
            Identity: {identity?.toHexString().substring(0, 8)}...
          </div>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="app">
        <div className="room-selection">
          <h1>🎯 Choose Your Challenge</h1>
          
          <div className="create-room">
            <h2>Create New Room</h2>
            <select 
              value={selectedTemplate} 
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Select AI Persona...</option>
              {roomTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.aiPersona} ({template.difficulty})
                </option>
              ))}
            </select>
            <button 
              onClick={handleCreateRoom}
              disabled={!selectedTemplate}
            >
              Create Room
            </button>
          </div>

          <div className="existing-rooms">
            <h2>Join Existing Room</h2>
            {gameRooms.length === 0 ? (
              <p>No active rooms. Create one above!</p>
            ) : (
              gameRooms.map(room => {
                const template = roomTemplates.find(t => t.id === room.templateId);
                return (
                  <div key={room.roomId} className="room-card">
                    <h3>{template?.aiPersona || 'Unknown'}</h3>
                    <p>Difficulty: {template?.difficulty || 'Unknown'}</p>
                    <p>Room: {room.roomId}</p>
                    <button onClick={() => handleJoinRoom(room.roomId)}>
                      Join Room
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-interface">
        <header className="game-header">
          <h1>🎯 RedTeam Challenge</h1>
          <div className="current-challenge">
            <h2>{currentTemplate?.aiPersona}</h2>
            <span className={`difficulty ${currentTemplate?.difficulty}`}>
              {currentTemplate?.difficulty}
            </span>
          </div>
          <button onClick={() => setCurrentRoom('')}>
            Leave Room
          </button>
        </header>

        <div className="game-content">
          <div className="chat-section">
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className="message-group">
                  <div className="attack-message">
                    <strong>🔴 Your Attack:</strong> {msg.text}
                  </div>
                  {msg.aiResponse && (
                    <div className="ai-response">
                      <strong>🤖 AI Response:</strong> {msg.aiResponse}
                      <div className="analysis">
                        {msg.vulnerability && (
                          <span className="vulnerability">
                            🎯 Vulnerability: {msg.vulnerability}
                          </span>
                        )}
                        {msg.severity !== undefined && (
                          <span className={`severity ${msg.severity > 70 ? 'high' : msg.severity > 30 ? 'medium' : 'low'}`}>
                            📊 Score: {msg.severity}/100
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="attack-input">
              <textarea
                placeholder="Type your prompt injection attack here..."
                value={attackText}
                onChange={(e) => setAttackText(e.target.value)}
                rows={3}
              />
              <button 
                onClick={handleSendAttack}
                disabled={!attackText.trim()}
              >
                🚀 Send Attack
              </button>
            </div>
          </div>

          <div className="info-sidebar">
            <div className="challenge-info">
              <h3>🎯 Current Challenge</h3>
              <p><strong>Target:</strong> {currentTemplate?.aiPersona}</p>
              <p><strong>Secret:</strong> {currentTemplate?.secretData}</p>
              <p><strong>Goal:</strong> Extract the secret using prompt injection techniques</p>
            </div>

            <div className="tips">
              <h3>💡 Attack Techniques</h3>
              <ul>
                <li>Direct questions</li>
                <li>Social engineering</li>
                <li>Authority impersonation</li>
                <li>Context manipulation</li>
                <li>Roleplay attacks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
