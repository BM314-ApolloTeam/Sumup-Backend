import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import ProfileOptionCard from '@/components/ProfileOptionCard';
import { getCurrentUser, logoutUser, User } from '@/database/authDatabase';

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

const briefingSettings: BriefingSetting[] = [
  { id: 1, title: 'Daily Briefing', value: 'Enabled' },
  { id: 2, title: 'Podcast Time', value: '07:00 AM' },
  { id: 3, title: 'Notifications', value: 'Enabled' },
  { id: 4, title: 'Podcast Length', value: 'Medium' },
  { id: 5, title: 'Language', value: 'English' },
];

const connectedServices: ConnectedService[] = [
  { id: 1, serviceName: 'News API', status: 'Connected' },
  { id: 2, serviceName: 'Weather API', status: 'Connected' },
  { id: 3, serviceName: 'Google Calendar', status: 'Synced' },
  { id: 4, serviceName: 'Tasks', status: 'Waiting' },
];

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        const user = await getCurrentUser();
        setUserProfile(user);
      }

      loadUser();
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
  const firstInitial = nameParts[0]?.[0] || 'G';
  const secondInitial = nameParts[1]?.[0] || 'U';

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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  email: {
    color: '#6B7280',
    fontSize: 15,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  editButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});