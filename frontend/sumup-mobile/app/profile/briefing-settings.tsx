import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
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

  const [showTimePicker, setShowTimePicker] = useState(false);

  const isDailyBriefingDisabled = dailyBriefing === 'Disabled';

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

  function handleDailyBriefingChange(value: 'Enabled' | 'Disabled') {
    setDailyBriefing(value);

    if (value === 'Disabled') {
      setNotifications('Disabled');
      setShowTimePicker(false);
    }
  }

  function getTimePickerValue() {
    const [hour, minute] = podcastTime.split(':').map(Number);

    const date = new Date();
    date.setHours(hour || 0);
    date.setMinutes(minute || 0);
    date.setSeconds(0);

    return date;
  }

  function handleTimeChange(event: unknown, selectedDate?: Date) {
    setShowTimePicker(false);

    if (!selectedDate) {
      return;
    }

    const hour = selectedDate.getHours().toString().padStart(2, '0');
    const minute = selectedDate.getMinutes().toString().padStart(2, '0');

    setPodcastTime(`${hour}:${minute}`);
  }

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
    disabled = false,
    onPress,
  }: {
    label: string;
    selected: boolean;
    disabled?: boolean;
    onPress: () => void;
  }) {
    return (
      <Pressable
        style={[
          styles.optionButton,
          selected && styles.selectedOption,
          disabled && styles.disabledOption,
        ]}
        disabled={disabled}
        onPress={onPress}
      >
        <Text
          style={[
            styles.optionText,
            selected && styles.selectedOptionText,
            disabled && styles.disabledOptionText,
          ]}
        >
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
            onPress={() => handleDailyBriefingChange('Enabled')}
          />

          <OptionButton
            label="Disabled"
            selected={dailyBriefing === 'Disabled'}
            onPress={() => handleDailyBriefingChange('Disabled')}
          />
        </View>

        <View style={isDailyBriefingDisabled && styles.disabledSection}>
          <Text
            style={[
              styles.label,
              isDailyBriefingDisabled && styles.disabledLabel,
            ]}
          >
            Podcast Time
          </Text>

          <Pressable
            style={[
              styles.timePickerButton,
              isDailyBriefingDisabled && styles.disabledOption,
            ]}
            disabled={isDailyBriefingDisabled}
            onPress={() => setShowTimePicker(true)}
          >
            <Text
              style={[
                styles.timePickerButtonText,
                isDailyBriefingDisabled && styles.disabledOptionText,
              ]}
            >
              {podcastTime}
            </Text>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={getTimePickerValue()}
              mode="time"
              display="spinner"
              is24Hour
              onChange={handleTimeChange}
            />
          )}

          <Text
            style={[
              styles.label,
              isDailyBriefingDisabled && styles.disabledLabel,
            ]}
          >
            Notifications
          </Text>

          <View style={styles.optionRow}>
            <OptionButton
              label="Enabled"
              selected={notifications === 'Enabled'}
              disabled={isDailyBriefingDisabled}
              onPress={() => setNotifications('Enabled')}
            />

            <OptionButton
              label="Disabled"
              selected={notifications === 'Disabled'}
              disabled={isDailyBriefingDisabled}
              onPress={() => setNotifications('Disabled')}
            />
          </View>
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
    backgroundColor: '#07001F',
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
    fontWeight: '800',
    color: '#60A5FA',
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 28,
  },

  card: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.42)',
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 10,
  },

  disabledLabel: {
    color: 'rgba(255,255,255,0.34)',
  },

  disabledSection: {
    opacity: 0.55,
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  selectedOption: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },

  disabledOption: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
  },

  optionText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.62)',
  },

  selectedOptionText: {
    color: '#FFFFFF',
  },

  disabledOptionText: {
    color: 'rgba(255,255,255,0.34)',
  },

  timePickerButton: {
    backgroundColor: 'rgba(0,0,0,0.24)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
  },

  timePickerButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});