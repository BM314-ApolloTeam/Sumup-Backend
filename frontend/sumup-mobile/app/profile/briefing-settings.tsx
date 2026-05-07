import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  BriefingSettings,
  defaultBriefingSettings,
  getCurrentUser,
  updateBriefingSettings,
} from '@/database/authDatabase';

export default function BriefingSettingsScreen() {
  const [dailyBriefing, setDailyBriefing] = useState(
    defaultBriefingSettings.dailyBriefing
  );
  const [podcastTime, setPodcastTime] = useState(
    defaultBriefingSettings.podcastTime
  );
  const [notifications, setNotifications] = useState(
    defaultBriefingSettings.notifications
  );
  const [podcastLength, setPodcastLength] = useState(
    defaultBriefingSettings.podcastLength
  );

  const timeOptions = [
    '00:00',
    '03:00',
    '06:00',
    '07:00',
    '09:00',
    '12:00',
    '15:00',
    '18:00',
    '21:00',
    '23:00',
  ];

  useFocusEffect(
    useCallback(() => {
      async function loadSettings() {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          return;
        }

        const settings = currentUser.briefingSettings || defaultBriefingSettings;

        setDailyBriefing(settings.dailyBriefing);
        setPodcastTime(settings.podcastTime);
        setNotifications(settings.notifications);
        setPodcastLength(settings.podcastLength);
      }

      loadSettings();
    }, [])
  );

  function handleSave() {
    const updatedSettings: BriefingSettings = {
      dailyBriefing,
      podcastTime,
      notifications,
      podcastLength,
    };

    Alert.alert(
      'Update Briefing Settings',
      'Do you want to save these settings?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async () => {
            const result = await updateBriefingSettings(updatedSettings);

            if (!result.success) {
              Alert.alert('Update Failed', result.message);
              return;
            }

            Alert.alert('Success', result.message, [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          },
        },
      ]
    );
  }

  function OptionButton({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) {
    return (
      <Pressable
        style={[styles.optionButton, selected && styles.selectedOption]}
        onPress={onPress}
      >
        <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Briefing Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Daily Briefing</Text>

        <View style={styles.optionRow}>
          <OptionButton
            label="Enabled"
            selected={dailyBriefing === 'Enabled'}
            onPress={() => setDailyBriefing('Enabled')}
          />

          <OptionButton
            label="Disabled"
            selected={dailyBriefing === 'Disabled'}
            onPress={() => setDailyBriefing('Disabled')}
          />
        </View>

        <Text style={styles.label}>Podcast Time</Text>

        <View style={styles.timeContainer}>
          {timeOptions.map((time) => (
            <OptionButton
              key={time}
              label={time}
              selected={podcastTime === time}
              onPress={() => setPodcastTime(time)}
            />
          ))}
        </View>

        <Text style={styles.label}>Notifications</Text>

        <View style={styles.optionRow}>
          <OptionButton
            label="Enabled"
            selected={notifications === 'Enabled'}
            onPress={() => setNotifications('Enabled')}
          />

          <OptionButton
            label="Disabled"
            selected={notifications === 'Disabled'}
            onPress={() => setNotifications('Disabled')}
          />
        </View>

        <Text style={styles.label}>Podcast Length</Text>

        <View style={styles.optionRow}>
          <OptionButton
            label="3 min"
            selected={podcastLength === '3 min'}
            onPress={() => setPodcastLength('3 min')}
          />

          <OptionButton
            label="5 min"
            selected={podcastLength === '5 min'}
            onPress={() => setPodcastLength('5 min')}
          />

          <OptionButton
            label="7 min"
            selected={podcastLength === '7 min'}
            onPress={() => setPodcastLength('7 min')}
          />
        </View>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </Pressable>
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

  backButton: {
    marginTop: 26,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 28,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    marginTop: 10,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  optionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  selectedOption: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },

  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },

  selectedOptionText: {
    color: '#FFFFFF',
  },

  saveButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});