import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import ProfileOptionCard from '@/components/ProfileOptionCard';
import { getCurrentUser, logoutUser, User } from '@/database/authDatabase';
import { getGoogleData, getWeatherData } from '@/services/api';

type BriefingSetting = {
  id: number;
  title: string;
  value: string;
};

type ConnectedService = {
  id: number;
  serviceName: string;
  status: 'Connected' | 'Synced' | 'Waiting' | 'Error';
};

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const [weatherStatus, setWeatherStatus] =
    useState<ConnectedService['status']>('Waiting');

  const [googleStatus, setGoogleStatus] =
    useState<ConnectedService['status']>('Waiting');

  useFocusEffect(
    useCallback(() => {
      async function loadProfileData() {
        const user = await getCurrentUser();
        setUserProfile(user);

        const weatherData = await getWeatherData();

        if (weatherData?.success === false) {
          setWeatherStatus('Error');
        } else {
          setWeatherStatus('Connected');
        }

        if (!user?.googleAccessToken) {
          setGoogleStatus('Waiting');
          return;
        }

        const googleData = await getGoogleData();

        if (googleData?.success === false) {
          setGoogleStatus('Error');
          return;
        }

        setGoogleStatus('Synced');
      }

      loadProfileData();
    }, [])
  );

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          router.replace('/welcome/welcome');
        },
      },
    ]);
  }

  const fullName = userProfile?.fullName || 'Guest User';
  const email = userProfile?.email || 'guest@example.com';

  const nameParts = fullName.trim().split(' ');
  const firstInitial = nameParts[0]?.[0]?.toUpperCase() || 'G';
  const secondInitial = nameParts[1]?.[0]?.toUpperCase() || 'U';

  const briefingSettings: BriefingSetting[] = [
    {
      id: 1,
      title: 'Daily Briefing',
      value: userProfile?.briefingSettings?.dailyBriefing || 'Enabled',
    },
    {
      id: 2,
      title: 'Podcast Time',
      value: userProfile?.briefingSettings?.podcastTime || '07:00',
    },
    {
      id: 3,
      title: 'Notifications',
      value: userProfile?.briefingSettings?.notifications || 'Disabled',
    },
  ];

  const connectedServices: ConnectedService[] = [
    {
      id: 1,
      serviceName: 'Weather API',
      status: weatherStatus,
    },
    {
      id: 2,
      serviceName: 'Google Calendar & Tasks',
      status: googleStatus,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstInitial}
            {secondInitial}
          </Text>
        </View>

        <Text style={styles.name}>{fullName}</Text>

        <Text style={styles.email}>{email}</Text>

        <Pressable
          style={styles.editButton}
          onPress={() => router.push('/profile/edit-profile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Briefing Settings</Text>

        {briefingSettings.map((setting) => (
          <Pressable
            key={setting.id}
            onPress={() => router.push('/profile/briefing-settings')}
          >
            <ProfileOptionCard title={setting.title} value={setting.value} />
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Data Sources</Text>

        {connectedServices.map((service) => (
          <ProfileOptionCard
            key={service.id}
            title={service.serviceName}
            status={service.status}
          />
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
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

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 30,
    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.32)',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  email: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    marginBottom: 16,
  },

  editButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  editButtonText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '800',
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
  },

  logoutButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },

  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});