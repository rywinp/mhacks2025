import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import { Link } from 'expo-router';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
}) => (
    <SafeAreaView style={styles.container}>
        {/* Photo Box with Same Styling as Camera */}
        <View style={styles.photoWrapper}>
            <Image
                style={styles.previewImage}
                source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
            />
        </View>

        {/* Buttons Below the Box */}
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleRetakePhoto}>
                <Fontisto name="trash" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => console.log("Confirm pressed!")}>
                <Fontisto name="check" size={28} color="white" />
            </TouchableOpacity>
        </View>
        

    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },

    photoWrapper: {
        aspectRatio: 5 / 8, // keeps the portrait ratio like camera view
        width: '96%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 20,
    },

    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '60%',
        marginTop: 20,
    },
    actionButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PhotoPreviewSection;
