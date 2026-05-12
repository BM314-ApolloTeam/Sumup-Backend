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

      <View style={styles.leftContent}>
        <Text style={styles.title}>
          {title}
        </Text>

        {value && (
          <Text style={styles.value}>
            {value}
          </Text>
        )}
      </View>

      {status && (
        <StatusBadge status={status} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftContent: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  value: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
  },
});