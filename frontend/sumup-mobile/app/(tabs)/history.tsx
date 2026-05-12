import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Podcast = {
  id: number;
  title: string;
  description: string;
  duration: string;
  createdAt: string;
  status: 'Completed' | 'Generating' | 'Failed';
};

export default function HistoryScreen() {
  const [playingPodcastId, setPlayingPodcastId] = useState<number | null>(null);

  const podcasts: Podcast[] = [];

  const handleReplay = (podcastId: number) => {
    setPlayingPodcastId(playingPodcastId === podcastId ? null : podcastId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Podcast History</Text>

      <Text style={styles.description}>
        View your previously generated daily podcast briefings.
      </Text>

      {podcasts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No podcast history yet</Text>

          <Text style={styles.emptyDescription}>
            Generated podcasts will appear here after your daily briefing is
            created.
          </Text>
        </View>
      ) : (
        podcasts.map((podcast) => (
          <View key={podcast.id} style={styles.card}>
            <Text style={styles.date}>{podcast.createdAt}</Text>

            <Text style={styles.cardTitle}>{podcast.title}</Text>

            <Text style={styles.cardDescription}>{podcast.description}</Text>

            <View style={styles.durationBox}>
              <Text style={styles.durationLabel}>Duration</Text>
              <Text style={styles.durationText}>{podcast.duration}</Text>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{podcast.status}</Text>
            </View>

            <Pressable
              style={styles.replayButton}
              onPress={() => handleReplay(podcast.id)}
            >
              <Text style={styles.replayButtonText}>
                {playingPodcastId === podcast.id
                  ? 'Hide Player'
                  : 'Replay Podcast'}
              </Text>
            </Pressable>

            {playingPodcastId === podcast.id && (
              <View style={styles.playerContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={styles.progressBarFill} />
                </View>

                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>0:00</Text>
                  <Text style={styles.timeText}>{podcast.duration}</Text>
                </View>

                <View style={styles.playCircle}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07001F',
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 30,
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 23,
    marginBottom: 28,
  },

  emptyCard: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.42)',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptyDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.66)',
    lineHeight: 22,
    textAlign: 'center',
  },

  card: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.42)',
  },

  date: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 0.8,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
  },

  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 22,
    marginBottom: 16,
  },

  durationBox: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  durationLabel: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '900',
    marginBottom: 5,
    letterSpacing: 0.8,
  },

  durationText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '900',
  },

  statusBox: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  statusText: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '900',
  },

  replayButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },

  replayButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  playerContainer: {
    marginTop: 18,
  },

  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },

  progressBarFill: {
    width: '0%',
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 10,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.62)',
    fontWeight: '700',
  },

  playCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginLeft: 3,
  },
});