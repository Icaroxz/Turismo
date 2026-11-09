import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

export function AccelerometerSection() {
  const [{ x, y, z }, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let subscription: any;
    let webInterval: any;

    const handleWebMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        setData({
          x: (event.accelerationIncludingGravity.x || 0) / 9.81,
          y: (event.accelerationIncludingGravity.y || 0) / 9.81,
          z: (event.accelerationIncludingGravity.z || 0) / 9.81,
        });
      }
    };

    if (Platform.OS === 'web') {
      // 1. Suporte para Web: Registra evento se suportado pelo navegador
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', handleWebMotion);
      }

      // 2. Simulador para Web (para PCs sem sensor físico)
      webInterval = setInterval(() => {
        setData({
          x: Number((Math.sin(Date.now() / 500) * 0.5).toFixed(3)),
          y: Number((Math.cos(Date.now() / 500) * 0.5).toFixed(3)),
          z: Number((1 + Math.sin(Date.now() / 1000) * 0.1).toFixed(3)),
        });
      }, 100);

    } else {
      // 3. Suporte NATIVO no celular (Expo Go)
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener((data) => {
        setData(data);
      });
    }

    // Função de limpeza corrigida
    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.removeEventListener('devicemotion', handleWebMotion);
        }
        if (webInterval) {
          clearInterval(webInterval);
        }
      }
    };
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>3. Movimentação (Acelerômetro)</Text>
      <Text style={styles.cardDescription}>
        Monitoramento em tempo real ({Platform.OS === 'web' ? 'Simulador Web' : 'Nativo'}):
      </Text>

      <View style={styles.grid}>
        <View style={styles.box}>
          <Text style={styles.label}>Eixo X</Text>
          <Text style={styles.value}>{x.toFixed(3)}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Eixo Y</Text>
          <Text style={styles.value}>{y.toFixed(3)}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Eixo Z</Text>
          <Text style={styles.value}>{z.toFixed(3)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#ffffff', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  cardDescription: { 
    fontSize: 12, 
    color: '#64748b', 
    marginTop: 2, 
    marginBottom: 12 
  },
  grid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 8 
  },
  box: { 
    flex: 1, 
    backgroundColor: '#f1f5f9', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#475569', 
    marginBottom: 4 
  },
  value: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
});