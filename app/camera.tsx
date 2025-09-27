import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import ItemSelectorSection from '@/components/ItemSelectorSection';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const [step, setStep] = useState("zero");

  if (!permission) return <View />;

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, exif: false };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  function handleConfirmPhoto() {
    setStep("one")
    console.log("handler works");

    return;
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
          <Text style={styles.grantButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === "one") {
    return <ItemSelectorSection photo={photo}/>;
  }

  if (photo) {
    return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} handleConfirmPhoto={handleConfirmPhoto} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'←'}</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <Text style={styles.instructionText}>
        Make sure the items are well-lit and centered in the frame for best results.
      </Text>

      {/* Camera Box */}
      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      </View>

      {/* Buttons (side by side) */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
          <Text style={styles.flipButtonText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.snapButton} onPress={handleTakePhoto} />
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-evenly', // distributes items vertically
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
  },
  backButtonText: { color: 'white', fontSize: 24 },

  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 2,
    borderRadius: 2,
  },

  cameraWrapper: {
    aspectRatio: 5 / 8, // keeps portrait shape
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  camera: { flex: 1 },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  snapButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#a4a6a4ff',
    borderWidth: 4,
    borderColor: 'white',
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  message: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  grantButton: {
    backgroundColor: 'rgba(255,255,255,0.2)', // semi-transparent to match the flip button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignSelf: 'center',
  },

  grantButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },

});
