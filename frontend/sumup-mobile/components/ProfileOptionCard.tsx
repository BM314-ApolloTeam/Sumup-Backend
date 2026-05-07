import { StyleSheet, Text, View } from 'react-native';

import StatusBadge from './StatusBadge';

type ProfileOptionCardProps = {
  title: string;
  value?: string;
  status?: string;
};

export default function ProfileOptionCard({
  title,
  value,
  status,
}: ProfileOptionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {title}
      </Text>

      {value && (
        <Text style={styles.value}>
          {value}
        </Text>
      )}

      {status && (
        <StatusBadge status={status} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  value: {
    fontSize: 14,
    color: '#6B7280',
  },
});