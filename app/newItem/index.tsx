// PhotoPreviewSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface Props {
  photo: any;
  handleRetakePhoto: () => void;
  handleConfirmPhoto: () => void;
}

export default function PhotoPreviewSection({ photo, handleRetakePhoto, handleConfirmPhoto }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.photo} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.redButton]} onPress={handleRetakePhoto}>
          <Text style={styles.buttonText}>Didn't fit everything?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleConfirmPhoto}>
          <Text style={styles.buttonText}>Ready to scan?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '90%',
    aspectRatio: 5 / 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#d9534f', // Bootstrap red
  },
  greenButton: {
    backgroundColor: '#5cb85c', // Bootstrap green
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
