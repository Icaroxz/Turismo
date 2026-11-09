import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export function CameraSection() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const handleStartCamera = async () => {
    // Solicitar permissão da câmera
    if (!permission?.granted) {
      const cameraResp = await requestPermission();
      if (!cameraResp.granted) {
        Alert.alert('Permissão Negada', 'Necessário acesso à câmera.');
        return;
      }
    }

    // Solicitar permissão da galeria
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    if (mediaStatus !== 'granted') {
      Alert.alert('Permissão Negada', 'Necessário acesso à galeria de fotos.');
      return;
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setPhotoUri(photo.uri);
          setShowCamera(false);
          await MediaLibrary.createAssetAsync(photo.uri);
          Alert.alert('Sucesso!', 'Foto salva na galeria!');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a foto.');
      }
    }
  };

  if (showCamera) {
    return (
      <View style={styles.fullCamera}>
        <CameraView 
          style={{ flex: 1, width: '100%', height: '100%' }} 
          facing="back" 
          ref={cameraRef}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCamera(false)}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <Text style={styles.btnText}>Tirar Foto</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>1. Fotografia do Local</Text>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Nenhuma foto capturada</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleStartCamera}>
        <Text style={styles.btnText}>Capturar Fotografia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 12 
  },
  placeholder: { 
    height: 160, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  placeholderText: { 
    color: '#94a3b8' 
  },
  preview: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8, 
    marginBottom: 12 
  },
  button: { 
    backgroundColor: '#0284c7', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  fullCamera: { 
    height: 350, 
    borderRadius: 12, 
    overflow: 'hidden', 
    position: 'relative' 
  },
  cameraControls: { 
    position: 'absolute', 
    bottom: 20, 
    left: 20, 
    right: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  cancelBtn: { 
    backgroundColor: '#ef4444', 
    padding: 12, 
    borderRadius: 8 
  },
  captureBtn: { 
    backgroundColor: '#22c55e', 
    padding: 12, 
    borderRadius: 8 
  },
});