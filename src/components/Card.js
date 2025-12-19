import { View, Text, StyleSheet } from 'react-native';

export default function Card({ title }) {
  return (
    <View style={styles.card}>
      <Text>{title || 'Movie Title'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
});
