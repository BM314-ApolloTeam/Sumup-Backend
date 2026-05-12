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
    'A short daily podcast created from weather, calendar events, and personal tasks.',
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
      name: 'Weather',
      provider: 'OpenWeather API',
      status: weatherMessage ? 'Error' : 'Not Connected',
      message: weatherMessage || 'Waiting for weather service response.',
    },
    {
      id: 2,
      name: 'Calendar & Tasks',
      provider: 'Google Calendar',
      status: googleMessage ? 'Error' : 'Not Connected',
      message:
        googleMessage || 'Waiting for Google Calendar and Tasks response.',
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

            <View style={styles.infoHeader}>
              <View>
                <Text style={styles.infoTitle}>{source.name}</Text>
                <Text style={styles.infoProvider}>{source.provider}</Text>
              </View>

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
    backgroundColor: '#0F0F1A',
  },

  content: {
    padding: 22,
    paddingBottom: 36,
  },

  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 34,
    marginBottom: 28,
  },

  briefingCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 28,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 6,
  },

  cardMeta: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.62)',
    fontWeight: '600',
  },

  statusBadge: {
    backgroundColor: 'rgba(255,122,0,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  statusText: {
    color: '#FF7A00',
    fontSize: 12,
    fontWeight: '800',
  },

  quoteText: {
    fontSize: 17,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 26,
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#FF7A00',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  sectionDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 22,
    marginBottom: 18,
  },

  infoGrid: {
    gap: 14,
  },

  infoBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 135,
  },

  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 5,
  },

  infoProvider: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },

  sourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginLeft: 12,
  },

  connectedBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },

  errorBadge: {
    backgroundColor: 'rgba(255,0,110,0.15)',
  },

  neutralBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  sourceBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  connectedText: {
    color: '#22C55E',
  },

  errorText: {
    color: '#FF006E',
  },

  neutralText: {
    color: 'rgba(255,255,255,0.62)',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },

  sourceMessage: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 19,
  },

  errorMessage: {
    color: '#FF006E',
    fontWeight: '600',
  },

  privacyCard: {
    backgroundColor: 'rgba(131,56,236,0.12)',
    borderRadius: 22,
    padding: 18,
    marginTop: 28,
    borderWidth: 1,
    borderColor: 'rgba(131,56,236,0.22)',
  },

  privacyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  privacyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 21,
  },
});