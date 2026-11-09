import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';

export function LocationSection() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada', 
          'É necessário permitir o acesso à localização para registrar as coordenadas.'
        );
        setLoading(false);
        return;
      }

      // Obter a posição atual
      const currentLocation = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.High 
      });
      
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização atual do dispositivo.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>2. Localização GPS</Text>
      
      {loading ? (
        <ActivityIndicator size="small" color="#0d9488" style={{ marginVertical: 12 }} />
      ) : location ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Latitude:</Text> {location.coords.latitude}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Longitude:</Text> {location.coords.longitude}
          </Text>
          <Text style={styles.subText}>
            Precisão: {location.coords.accuracy?.toFixed(2)}m
          </Text>
        </View>
      ) : (
        <Text style={styles.placeholderText}>Clique no botão abaixo para obter a sua localização.</Text>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGetLocation} 
        disabled={loading}
      >
        <Text style={styles.btnText}>Obter Localização Atual</Text>
      </TouchableOpacity>
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
    marginBottom: 12, 
    color: '#1e293b' 
  },
  placeholderText: { 
    color: '#94a3b8', 
    fontSize: 14, 
    marginBottom: 12 
  },
  infoBox: { 
    backgroundColor: '#f0fdf4', 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#bbf7d0', 
    marginBottom: 12 
  },
  infoText: { 
    color: '#166534', 
    fontSize: 14, 
    marginBottom: 4 
  },
  subText: { 
    color: '#15803d', 
    fontSize: 12, 
    marginTop: 4 
  },
  boldText: { 
    fontWeight: 'bold' 
  },
  button: { 
    backgroundColor: '#0d9488', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  btnText: { 
    color: '#ffffff', 
    fontWeight: 'bold' 
  },
});