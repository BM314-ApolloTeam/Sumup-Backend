import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import StatusBadge from '@/components/StatusBadge';

type PodcastBriefing = {
  id: number;
  label: string;
  title: string;
  description: string;
  duration: string;
  audioUrl: string | null;
  status: 'ready' | 'generating' | 'not_created';
};

type DataSourceStatus = {
  id: number;
  name: string;
  status: 'Connected' | 'Synced' | 'Waiting' | 'Error';
};

const podcastBriefing: PodcastBriefing = {
  id: 1,
  label: "TODAY'S PODCAST",
  title: 'Morning Briefing - 07:00 AM',
  description:
    'Includes latest headlines, weather updates, calendar reminders, and personal tasks.',
  duration: '3 min 42 sec',
  audioUrl: null,
  status: 'ready',
};

const dataSourceStatuses: DataSourceStatus[] = [
  { id: 1, name: 'News API', status: 'Connected' },
  { id: 2, name: 'Weather API', status: 'Connected' },
  { id: 3, name: 'Google Calendar', status: 'Synced' },
  { id: 4, name: 'Tasks', status: 'Waiting' },
];

export default function PodcastScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Podcast Briefing</Text>

      <Text style={styles.description}>
        Your personalized daily audio summary generated from connected data
        sources.
      </Text>

      <View style={styles.mainCard}>
        <Text style={styles.label}>{podcastBriefing.label}</Text>

        <View style={styles.statusContainer}>
          <StatusBadge status="Completed" />
        </View>

        <Text style={styles.podcastTitle}>{podcastBriefing.title}</Text>

        <Text style={styles.podcastDescription}>
          {podcastBriefing.description}
        </Text>

        <Text style={styles.duration}>
          Duration: {podcastBriefing.duration}
        </Text>

        <Pressable style={styles.playButton}>
          <Text style={styles.playButtonText}>Play Podcast</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Data Sources</Text>

        {dataSourceStatuses.map((source) => (
          <View key={source.id} style={styles.sourceCard}>
            <View>
              <Text style={styles.sourceTitle}>{source.name}</Text>
              <Text style={styles.sourceDescription}>
                Used for generating podcast briefings.
              </Text>
            </View>

            <StatusBadge status={source.status} />
          </View>
        ))}
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
    marginBottom: 12,
    textAlign: 'center',
  },

  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 23,
    marginBottom: 28,
    textAlign: 'center',
  },

  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 12,
    letterSpacing: 1,
  },

  statusContainer: {
    marginBottom: 14,
  },

  podcastTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },

  podcastDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },

  duration: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
    marginBottom: 22,
  },

  playButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },

  sourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sourceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  sourceDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
});