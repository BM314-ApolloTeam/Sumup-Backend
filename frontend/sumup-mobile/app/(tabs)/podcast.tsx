import { useEffect, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import StatusBadge from '@/components/StatusBadge';
import { getGoogleData, getWeatherData } from '@/services/api';

type PodcastBriefing = {
  id: number;
  label: string;
  title: string;
  description: string;
  duration: string | null;
  audioUrl: string | null;
  status: 'ready' | 'generating' | 'not_created';
};

type DataSourceStatus = {
  id: number;
  name: string;
  status: 'Connected' | 'Synced' | 'Waiting' | 'Error';
};

export default function PodcastScreen() {
  const [podcastBriefing] = useState<PodcastBriefing | null>(null);

  const [weatherStatus, setWeatherStatus] =
    useState<DataSourceStatus['status']>('Waiting');

  const [googleStatus, setGoogleStatus] =
    useState<DataSourceStatus['status']>('Waiting');

  useEffect(() => {
    async function checkWeatherStatus() {
      const data = await getWeatherData();

      if (data?.success === false) {
        setWeatherStatus('Error');
        return;
      }

      setWeatherStatus('Connected');
    }

    async function checkGoogleStatus() {
      const data = await getGoogleData();

      if (data?.success === false) {
        setGoogleStatus('Error');
        return;
      }

      setGoogleStatus('Synced');
    }

    checkWeatherStatus();
    checkGoogleStatus();
  }, []);

  const dataSourceStatuses: DataSourceStatus[] = [
    { id: 1, name: 'Weather API', status: weatherStatus },
    { id: 2, name: 'Google Calendar & Tasks', status: googleStatus },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Podcast Briefing</Text>

      <Text style={styles.description}>
        Your personalized daily audio summary generated from connected data
        sources.
      </Text>

      <View style={styles.mainCard}>
        {podcastBriefing ? (
          <>
            <Text style={styles.label}>{podcastBriefing.label}</Text>

            <View style={styles.statusContainer}>
              <StatusBadge status="Completed" />
            </View>

            <Text style={styles.podcastTitle}>{podcastBriefing.title}</Text>

            <Text style={styles.podcastDescription}>
              {podcastBriefing.description}
            </Text>

            {podcastBriefing.duration && (
              <View style={styles.durationBox}>
                <Text style={styles.durationLabel}>Duration</Text>
                <Text style={styles.durationText}>
                  {podcastBriefing.duration}
                </Text>
              </View>
            )}

            <View style={styles.playerContainer}>
              <View style={styles.progressBarBackground}>
                <View style={styles.progressBarFill} />
              </View>

              <View style={styles.timeRow}>
                <Text style={styles.timeText}>0:00</Text>
                <Text style={styles.timeText}>
                  {podcastBriefing.duration ?? '0:00'}
                </Text>
              </View>

              <View style={styles.playCircle}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>NO PODCAST YET</Text>

            <Text style={styles.podcastTitle}>
              Podcast cannot be created yet.
            </Text>

            <Text style={styles.podcastDescription}>
              Connect your weather, calendar, and task data sources before
              creating a personalized podcast briefing.
            </Text>

            <View style={styles.disabledButton}>
              <Text style={styles.disabledButtonText}>
                Connect Data Sources First
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Data Sources</Text>

        {dataSourceStatuses.map((source) => (
          <View key={source.id} style={styles.sourceCard}>
            <View style={styles.sourceTextContainer}>
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
    backgroundColor: '#0F0F1A',
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

  mainCard: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderRadius: 28,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.36)',
  },

  label: {
    fontSize: 12,
    fontWeight: '900',
    color: '#93C5FD',
    marginBottom: 12,
    letterSpacing: 1.2,
  },

  statusContainer: {
    marginBottom: 14,
  },

  podcastTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  podcastDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 24,
    marginBottom: 18,
  },

  durationBox: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
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
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '900',
  },

  playerContainer: {
    marginTop: 4,
  },

  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
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
    color: 'rgba(255,255,255,0.58)',
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

    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  playIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginLeft: 3,
  },

  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  disabledButtonText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    fontWeight: '800',
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  sourceCard: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.32)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sourceTextContainer: {
    flex: 1,
    marginRight: 12,
  },

  sourceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  sourceDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.62)',
  },
});