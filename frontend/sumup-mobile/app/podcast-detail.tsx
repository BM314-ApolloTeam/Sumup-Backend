import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function PodcastDetailScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  const duration = '3 min 42 sec';

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    console.log('Rewind 10 seconds');
  };

  const handleForward = () => {
    console.log('Forward 10 seconds');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Podcast Details</Text>

      <View style={styles.card}>
        <Text style={styles.date}>Today • 07:00 AM</Text>

        <Text style={styles.podcastTitle}>Morning Summary Podcast</Text>

        <Text style={styles.description}>
          Weather updates, calendar events, and daily tasks were summarized.
        </Text>

        <View style={styles.durationBox}>
          <Text style={styles.durationLabel}>Duration</Text>
          <Text style={styles.durationText}>{duration}</Text>
        </View>

        <Text style={styles.info}>Status: Completed</Text>

        <View style={styles.playerRow}>
          <Pressable style={styles.controlButton} onPress={handleRewind}>
            <Text style={styles.controlText}>-10s</Text>
          </Pressable>

          <Pressable style={styles.playButton} onPress={handlePlayPause}>
            <Text style={styles.playButtonText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </Pressable>

          <Pressable style={styles.controlButton} onPress={handleForward}>
            <Text style={styles.controlText}>+10s</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>

        <Text style={styles.text}>
          This podcast briefing includes weather updates, calendar reminders,
          and personal task summaries for the day.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Used Data Sources</Text>

        <Text style={styles.text}>Weather API</Text>
        <Text style={styles.text}>Google Calendar</Text>
        <Text style={styles.text}>Tasks</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginTop: 30,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  date: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 10,
  },
  podcastTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 23,
    marginBottom: 18,
  },
  durationBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  durationLabel: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '800',
  },
  info: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
    marginBottom: 18,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  controlText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
  playButton: {
    backgroundColor: '#111827',
    paddingVertical: 15,
    paddingHorizontal: 36,
    borderRadius: 18,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 6,
  },
});