import { ScrollView, StyleSheet, Text } from 'react-native';

import EmptyState from '@/components/EmptyState';
import PodcastCard from '@/components/PodcastCard';
import { router } from 'expo-router';

type Podcast = {
  id: number;
  title: string;
  description: string;
  duration: string;
  createdAt: string;
  status: 'Completed' | 'Generating' | 'Failed';
};

const podcasts: Podcast[] = [
  {
    id: 1,
    title: 'Morning Summary Podcast',
    description: 'News, weather, calendar events, and daily tasks were summarized.',
    duration: '3 min 42 sec',
    createdAt: 'Today • 07:00 AM',
    status: 'Completed',
  },
  {
    id: 2,
    title: 'Daily Briefing Podcast',
    description: 'Personalized podcast generated from external data sources.',
    duration: '4 min 10 sec',
    createdAt: 'Yesterday • 07:00 AM',
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Morning Podcast Brief',
    description: 'Podcast created from news, weather, and calendar data.',
    duration: '3 min 25 sec',
    createdAt: 'May 5, 2026 • 07:00 AM',
    status: 'Completed',
  },
];

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Podcast History</Text>

      <Text style={styles.description}>
        View your previously generated daily podcast briefings.
      </Text>

      {podcasts.length === 0 ? (
        <EmptyState
          title="No podcast history yet"
          description="Generated podcasts will appear here after your daily briefing is created."
        />
      ) : (
        podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            date={podcast.createdAt}
            title={podcast.title}
            description={podcast.description}
            duration={`Duration: ${podcast.duration}`}
            status={podcast.status}
          />
        ))
      )}
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
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 23,
    marginBottom: 24,
  },
});