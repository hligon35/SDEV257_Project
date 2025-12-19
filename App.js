import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppUI from './src/ui/AppUI';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppUI />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
