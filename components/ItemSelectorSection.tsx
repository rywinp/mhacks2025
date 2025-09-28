import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CameraCapturedPicture } from 'expo-camera';
import { Fontisto } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as API from '../hooks/supabaseFront';


interface Props {
    photo: CameraCapturedPicture;
}

interface Item {
    food_name: string;
    shelf_life: number;
    carbon_footprint: number;
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
        const fetchData = async () => {
            try {
                console.log("Fetching data from API...");
                const base64 = photo.base64; // make sure photo is defined

                const response = await fetch(
                    "redbullftw-cm9qo0no7-rywins-projects.vercel.app/api/analyze-food",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            image_data: base64,
                            file_extension: "jpeg",
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                    console.log(response);
                }
                const data = await response.json();
                console.log("API response:", data);
                const items = JSON.parse(data.analysis_result);
                setData(items); // <-- store API response in state
                setSet(true);  // <-- your existing flag
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        if (data.length === 0 && set === true) {
            if (data.length === 0) {
                router.replace('/(tabs)/app'); // redirect to home page
            }
        }
    }, [data, set]);

    if (set === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Detecting Items...</Text>
                <Text style={styles.placeholder}>Please wait while we analyze the photo.</Text>
            </View>
        );
    }

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
    console.log("Rendering item:", item);
    return (
        <View style={styles.itemCard}>
            {/* Image */}
            <Image
                source={{ uri: `https://zrmjikvmsxwlpngwrpey.supabase.co/storage/v1/object/public/Images/${item.food_name}.png` }} // item.image should be a URL string
                style={styles.itemImage}
            />


            {/* Name */}
            <Text style={styles.itemName}>{item.food_name}</Text>

            {/* Shelf life */}
            <Text style={styles.shelfLife}>Shelf Life: {item.shelf_life} days</Text>

            {/* Shelf life */}
            <Text style={styles.shelfLife}>Carbon Footprint: {item.carbon_footprint} days</Text>

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