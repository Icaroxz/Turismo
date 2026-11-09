import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { CameraSection } from './src/components/CameraSection';
import { LocationSection } from './src/components/LocationSection';
import { AccelerometerSection } from './src/components/AccelerometerSection';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Diário de Viagem</Text>
          <Text style={styles.subtitle}>Recursos Nativos Unificados</Text>
        </View>

        <CameraSection />
        <LocationSection />
        <AccelerometerSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 16 },
  header: { alignItems: 'center', marginVertical: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b' },
});