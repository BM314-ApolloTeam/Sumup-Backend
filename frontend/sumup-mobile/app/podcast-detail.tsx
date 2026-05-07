import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

export default function PodcastDetailScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Podcast Details</Text>

      <View style={styles.card}>
        <Text style={styles.date}>Today • 07:00 AM</Text>

        <Text style={styles.podcastTitle}>Morning Summary Podcast</Text>

        <Text style={styles.description}>
          News, weather, calendar events, and daily tasks were summarized.
        </Text>

        <Text style={styles.info}>Duration: 3 min 42 sec</Text>
        <Text style={styles.info}>Status: Completed</Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Replay Podcast</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>

        <Text style={styles.text}>
          This podcast briefing includes the latest headlines, weather updates,
          calendar reminders, and personal task summaries for the day.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Used Data Sources</Text>

        <Text style={styles.text}>News API</Text>
        <Text style={styles.text}>Weather API</Text>
        <Text style={styles.text}>Google Calendar</Text>
        <Text style={styles.text}>Tasks</Text>
      </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  date: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 10,
  },
  podcastTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 23,
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 6,
  },
});