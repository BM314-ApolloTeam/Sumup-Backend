import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { router } from 'expo-router';
import { useEffect } from 'react';

import { getCurrentUser } from '@/database/authDatabase';

export default function InitialScreen() {
  useEffect(() => {
    async function checkSession() {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        router.replace('/(tabs)');
      } else {
        router.replace('/welcome/welcome');
      }
    }

    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#111827" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});