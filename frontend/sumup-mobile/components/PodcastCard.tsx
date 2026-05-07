import { Pressable, StyleSheet, Text, View } from 'react-native';

import StatusBadge from './StatusBadge';

type PodcastCardProps = {
  title: string;
  description: string;
  duration: string;
  date: string;
  status: string;
};

export default function PodcastCard({
  title,
  description,
  duration,
  date,
  status,
}: PodcastCardProps) {
  return (
    <View style={styles.card}>

      <View style={styles.header}>
        <Text style={styles.date}>
          {date}
        </Text>

        <StatusBadge status={status} />
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <View style={styles.footer}>

        <Text style={styles.duration}>
          {duration}
        </Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            Replay
          </Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  date: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
  },

  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 14,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  duration: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
  },

  button: {
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});