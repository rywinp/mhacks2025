import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CameraCapturedPicture } from 'expo-camera';
import { Fontisto } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


interface Props {
    photo: CameraCapturedPicture;
}

interface Item {
    name: string;
    shelf_life: number;
    image: string;
}

export default function ItemSelectorSection({ photo }: Props) {

    const router = useRouter();
    // const { uploadImage, uploading, error } = useUploadImage();

    // useEffect(() => {
    //     const upload = async () => {
    //         const path = await uploadImage(photo);
    //         if (path) {
    //             console.log('Image uploaded to:', path);
    //         } else {
    //             console.log('Upload failed:', error);
    //         }
    //     };

    //     upload();
    // }, []); // empty dependency array runs this effect once

    const [data, setData] = useState<Item[]>([]);
    const [set, setSet] = useState<boolean>(false);
    const [modifiedData, setModifiedData] = useState<Item[]>([]);


    function handleNext(item: Item) {
        setModifiedData(prev => [...prev, item]);
        setData(prev => prev.slice(1));
        console.log("Added:", item);
    }

    function handleDecline() {
        console.log("Deleted:", data[0]);
        setData(prev => prev.slice(1));
    }

    useEffect(() => {
        // Initial placeholder data
        setData([
            { name: "Banana", shelf_life: 5, image: "" },
            { name: "Grapes", shelf_life: 3, image: "" }
        ]);
        setSet(true);
    }, []);

    useEffect(() => {
        if (data.length === 0 && set === true) {
            if (data.length === 0) {
                router.replace('/(tabs)/app'); // redirect to home page
            }
        }
    }, [data])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detected Items</Text>

            {data.length === 0 ? (
                <Text style={styles.placeholder}>No items left.</Text>
            ) : (
                <ItemImageComponent
                    item={data[0]}
                    handleNext={handleNext}
                    handleDecline={handleDecline}
                />
            )}
        </View>
    );
}

function ItemImageComponent({
    item,
    handleNext,
    handleDecline
}: {
    item: Item;
    handleNext: (item: Item) => void;
    handleDecline: () => void;
}) {
    return (
        <View style={styles.itemCard}>
            {/* Image */}
            <Image
                source={require('@/assets/images/banana.jpg')} // replace with item.image if available
                style={styles.itemImage}
            />

            {/* Name */}
            <Text style={styles.itemName}>{item.name}</Text>

            {/* Shelf life */}
            <Text style={styles.shelfLife}>Shelf Life: {item.shelf_life} days</Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: 'red' }]}
                    onPress={handleDecline}
                >
                    <Fontisto name="close" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: 'green' }]}
                    onPress={() => handleNext(item)}
                >
                    <Fontisto name="check" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 20,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    placeholder: {
        color: 'gray',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },
    itemCard: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemImage: {
        width: '100%',
        resizeMode: 'cover',
        aspectRatio: 7 / 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 50,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    itemName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    shelfLife: {
        fontSize: 18,
        color: 'lightgray',
        marginBottom: 50,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    actionButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
});