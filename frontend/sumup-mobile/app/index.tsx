import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { router } from 'expo-router';
import { useEffect } from 'react';

import { getCurrentUser } from '@/database/authDatabase';

export default function InitialScreen() {
  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = await getCurrentUser();

        console.log('Current User:', currentUser);

        if (currentUser) {
          router.replace('/(tabs)');
        } else {
          router.replace('/welcome/welcome');
        }
      } catch (error) {
        console.log('Session Error:', error);

        router.replace('/welcome/welcome');
      }
    }

    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF7A00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});