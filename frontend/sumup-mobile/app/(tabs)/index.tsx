import React, { useEffect, useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getGoogleData, getWeatherData } from '@/services/api';

type DailyBriefing = {
  title: string;
  description: string;
  scheduledTime: string;
  status: 'Waiting' | 'Ready' | 'Generating';
};

type DataSource = {
  id: number;
  name: string;
  provider: string;
  status: 'Connected' | 'Error' | 'Not Connected';
  message: string;
};

const dailyBriefing: DailyBriefing = {
  title: 'Morning Summary Podcast',
  description:
    'A short daily podcast created from news, weather, calendar events, and personal tasks.',
  scheduledTime: 'Today • 07:00 AM',
  status: 'Waiting',
};

export default function HomeScreen() {
  const [weatherMessage, setWeatherMessage] = useState('');
  const [googleMessage, setGoogleMessage] = useState('');

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getWeatherData();
        setWeatherMessage(data.message ?? 'Weather data loaded.');
      } catch (error) {
        console.log('Weather API Error:', error);
        setWeatherMessage('Weather service connection failed.');
      }
    }

    async function fetchGoogleData() {
      try {
        const data = await getGoogleData();
        setGoogleMessage(data.message ?? 'Google data loaded.');
      } catch (error) {
        console.log('Google API Error:', error);
        setGoogleMessage('Google service connection failed.');
      }
    }

    fetchWeather();
    fetchGoogleData();
  }, []);

  const dataSources: DataSource[] = [
    {
      id: 1,
      name: 'News',
      provider: 'News API',
      status: 'Connected',
      message: 'Latest news and headlines are ready to be summarized.',
    },
    {
      id: 2,
      name: 'Weather',
      provider: 'OpenWeather API',
      status: weatherMessage ? 'Error' : 'Not Connected',
      message: weatherMessage || 'Waiting for weather service response.',
    },
    {
      id: 3,
      name: 'Calendar',
      provider: 'Google Calendar',
      status: googleMessage ? 'Error' : 'Not Connected',
      message: googleMessage || 'Waiting for Google Calendar response.',
    },
    {
      id: 4,
      name: 'Tasks',
      provider: 'Todoist',
      status: 'Not Connected',
      message: 'Connect your Todoist account to include your daily tasks.',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      <Text style={styles.logo}>SUMUP</Text>

      <View style={styles.briefingCard}>
        <View style={styles.briefingHeader}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>🎙️</Text>
          </View>

          <View style={styles.briefingInfo}>
            <Text style={styles.cardTitle}>{dailyBriefing.title}</Text>
            <Text style={styles.cardMeta}>{dailyBriefing.scheduledTime}</Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{dailyBriefing.status}</Text>
          </View>
        </View>

        <Text style={styles.quoteText}>
          "{dailyBriefing.description}"
        </Text>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Create Daily Podcast</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Data Sources</Text>
      <Text style={styles.sectionDescription}>
        We collect and summarize data from your connected services.
      </Text>

      <View style={styles.infoGrid}>
        {dataSources.map((source) => (
          <View key={source.id} style={styles.infoBox}>
            <Text style={styles.infoTitle}>{source.name}</Text>
            <Text style={styles.infoProvider}>{source.provider}</Text>

            <View
              style={[
                styles.sourceBadge,
                source.status === 'Connected'
                  ? styles.connectedBadge
                  : source.status === 'Error'
                    ? styles.errorBadge
                    : styles.neutralBadge,
              ]}>
              <Text
                style={[
                  styles.sourceBadgeText,
                  source.status === 'Connected'
                    ? styles.connectedText
                    : source.status === 'Error'
                      ? styles.errorText
                      : styles.neutralText,
                ]}>
                {source.status}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text
              style={[
                styles.sourceMessage,
                source.status === 'Error' && styles.errorMessage,
              ]}>
              {source.message}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.privacyCard}>
        <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
        <Text style={styles.privacyText}>
          Your data is used only to generate your daily podcast.
        </Text>
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
    padding: 22,
    paddingBottom: 36,
  },

  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 34,
    marginBottom: 28,
  },

  briefingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  briefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  iconText: {
    fontSize: 28,
  },

  briefingInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 19,
    color: '#111827',
    fontWeight: '800',
    marginBottom: 6,
  },

  cardMeta: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },

  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  statusText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800',
  },

  quoteText: {
    fontSize: 17,
    fontStyle: 'italic',
    color: '#4B5563',
    lineHeight: 26,
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  sectionDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 18,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },

  infoBox: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    minHeight: 180,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 5,
  },

  infoProvider: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },

  sourceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 12,
  },

  connectedBadge: {
    backgroundColor: '#DCFCE7',
  },

  errorBadge: {
    backgroundColor: '#FEE2E2',
  },

  neutralBadge: {
    backgroundColor: '#F3F4F6',
  },

  sourceBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  connectedText: {
    color: '#16A34A',
  },

  errorText: {
    color: '#DC2626',
  },

  neutralText: {
    color: '#6B7280',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },

  sourceMessage: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
  },

  errorMessage: {
    color: '#DC2626',
    fontWeight: '600',
  },

  privacyCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    padding: 18,
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },

  privacyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#312E81',
    marginBottom: 8,
  },

  privacyText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
  },
});