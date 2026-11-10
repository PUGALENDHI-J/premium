import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

type RobotState = 'IDLE' | 'LISTENING' | 'THINKING' | 'RESPONDING';

interface Message {
  id: string;
  sender: 'user' | 'nexa';
  text: string;
  agent?: string;
  matchScore?: number;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'nexa',
      text: '⚡ NEXA Quantum Mobile Online. I am your mobile intelligence companion. Issue a voice or text command to navigate opportunities, audit resumes, or track lessons.',
      agent: 'NEXA_CORE',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [robotState, setRobotState] = useState<RobotState>('IDLE');
  const [activeTab, setActiveTab] = useState<'chat' | 'career' | 'jobs' | 'learning'>('chat');

  // Animation values for compact floating robot
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating oscillation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse core
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setRobotState('THINKING');

    setTimeout(() => {
      setRobotState('RESPONDING');

      let replyText = '';
      let matchScore: number | undefined;

      if (text.toLowerCase().includes('job') || text.toLowerCase().includes('skill')) {
        replyText =
          '🎯 7-Factor Fit: Principal Distributed Systems Engineer at NexaCloud. Your verified Go and Raft credentials yield a 94% compatibility match.';
        matchScore = 94;
      } else if (text.toLowerCase().includes('resume') || text.toLowerCase().includes('plan')) {
        replyText =
          '📋 Resume Audit Complete: 7.5 Years verified experience. High-leverage bridging track: GPU memory management and vLLM inference (+12% match gain).';
      } else {
        replyText =
          '⚡ NEXA Mobile Telemetry: 42.4k enterprise jobs active, 1,240 certified courses indexed. All interactions DPDP Tier-1 protected.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `nx-${Date.now()}`,
          sender: 'nexa',
          text: replyText,
          agent: 'NEXA_TALENT',
          matchScore,
        },
      ]);

      setTimeout(() => setRobotState('IDLE'), 2400);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>QX</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>NEXATALENT QX</Text>
            <Text style={styles.brandSubtitle}>Quantum Mobile Operating System</Text>
          </View>
        </View>

        <View style={styles.stateChip}>
          <View
            style={[
              styles.stateDot,
              {
                backgroundColor:
                  robotState === 'THINKING'
                    ? '#a855f7'
                    : robotState === 'RESPONDING'
                    ? '#00f0ff'
                    : '#10b981',
              },
            ]}
          />
          <Text style={styles.stateText}>{robotState}</Text>
        </View>
      </View>

      {/* Compact Interactive NEXA Robot Stage */}
      <View style={styles.robotStage}>
        <Animated.View
          style={[
            styles.robotContainer,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          {/* Outer Hologram Halo */}
          <View style={styles.holoHalo} />

          {/* Robot Head Body */}
          <View style={styles.robotHead}>
            {/* Ocular Sensors (Glowing Eyes) */}
            <View style={styles.eyeRow}>
              <View
                style={[
                  styles.eye,
                  {
                    backgroundColor:
                      robotState === 'THINKING' ? '#c084fc' : '#00f0ff',
                  },
                ]}
              />
              <View
                style={[
                  styles.eye,
                  {
                    backgroundColor:
                      robotState === 'THINKING' ? '#c084fc' : '#00f0ff',
                  },
                ]}
              />
            </View>

            {/* Glowing Transparent Core / Mouth */}
            <Animated.View
              style={[
                styles.quantumCore,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.coreIcon}>⚡</Text>
            </Animated.View>
          </View>

          {/* Metallic Neck / Torso Plate */}
          <View style={styles.robotTorso} />
        </Animated.View>

        <Text style={styles.robotLabel}>NEXA — Quantum Intelligence Entity</Text>
      </View>

      {/* Conversation Feed */}
      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.messageBubble,
              m.sender === 'user' ? styles.userBubble : styles.nexaBubble,
            ]}
          >
            {m.agent && (
              <Text style={styles.agentTag}>🤖 {m.agent}</Text>
            )}
            <Text style={styles.messageText}>{m.text}</Text>
            {m.matchScore && (
              <View style={styles.matchPill}>
                <Text style={styles.matchPillText}>
                  ★ 7-Factor Fit: {m.matchScore}% Match
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Suggestion Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionRow}
        contentContainerStyle={styles.suggestionContent}
      >
        <TouchableOpacity
          style={styles.chip}
          onPress={() => handleSend('Find jobs matching my skills')}
        >
          <Text style={styles.chipText}>💼 Match Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => handleSend('Analyse my resume')}
        >
          <Text style={styles.chipText}>📄 Audit Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => handleSend('What skills am I missing?')}
        >
          <Text style={styles.chipText}>🔍 Skill Gaps</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Input Command Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask NEXA anything..."
          placeholderTextColor="#64748b"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSend()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Mobile Safe Bottom Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabIcon, activeTab === 'chat' && styles.tabActive]}>
            🤖
          </Text>
          <Text style={[styles.tabText, activeTab === 'chat' && styles.tabActive]}>
            NEXA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleSend('Show my 14-month career constellation')}
        >
          <Text style={styles.tabIcon}>🚀</Text>
          <Text style={styles.tabText}>Career</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleSend('List top verified jobs')}
        >
          <Text style={styles.tabIcon}>💼</Text>
          <Text style={styles.tabText}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleSend('Show my course progress')}
        >
          <Text style={styles.tabIcon}>🎓</Text>
          <Text style={styles.tabText}>Courses</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.2)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#00f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#030712',
    fontWeight: 'bold',
    fontSize: 14,
  },
  brandTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  stateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  stateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stateText: {
    color: '#00f0ff',
    fontSize: 10,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  robotStage: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  robotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  holoHalo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  robotHead: {
    width: 68,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38bdf8',
    shadowColor: '#00f0ff',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 6,
  },
  eye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#00f0ff',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  quantumCore: {
    width: 22,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00f0ff',
  },
  coreIcon: {
    fontSize: 9,
    color: '#00f0ff',
  },
  robotTorso: {
    width: 44,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#94a3b8',
    marginTop: 2,
  },
  robotLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: width * 0.85,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  nexaBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderBottomLeftRadius: 4,
  },
  agentTag: {
    color: '#00f0ff',
    fontSize: 10,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  messageText: {
    color: '#f8fafc',
    fontSize: 13,
    lineHeight: 18,
  },
  matchPill: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  matchPillText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  suggestionRow: {
    maxHeight: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  suggestionContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.2)',
    backgroundColor: '#030712',
  },
  input: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#f8fafc',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendButton: {
    backgroundColor: '#00f0ff',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  sendButtonText: {
    color: '#030712',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#030712',
  },
  tabItem: {
    alignItems: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 18,
    color: '#64748b',
  },
  tabText: {
    fontSize: 10,
    color: '#64748b',
  },
  tabActive: {
    color: '#00f0ff',
    fontWeight: 'bold',
  },
});

