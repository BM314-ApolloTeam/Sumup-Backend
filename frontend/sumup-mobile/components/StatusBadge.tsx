import { StyleSheet, Text } from 'react-native';

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const badgeStyle = getBadgeStyle(status);

  return (
    <Text style={[styles.badge, badgeStyle]}>
      {status}
    </Text>
  );
}

function getBadgeStyle(status: string) {
  if (
    status === 'Connected' ||
    status === 'Synced' ||
    status === 'Completed'
  ) {
    return styles.successBadge;
  }

  if (status === 'Waiting' || status === 'Generating') {
    return styles.warningBadge;
  }

  if (status === 'Error' || status === 'Failed' || status === 'Disconnected') {
    return styles.errorBadge;
  }

  return styles.defaultBadge;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  successBadge: {
    backgroundColor: '#DCFCE7',
    color: '#16A34A',
  },
  warningBadge: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  errorBadge: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  defaultBadge: {
    backgroundColor: '#E5E7EB',
    color: '#374151',
  },
});