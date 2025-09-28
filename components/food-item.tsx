import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export type FoodItemProps = {
  name: string;
  shelfLife: string;
  image?: string; // optional image URL
};

export default function FoodItem({ name, shelfLife, image }: FoodItemProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.content}>
        {/* Image or Placeholder */}
        {image ? (
          <Image source={require( "@/assets/images/Tung.png")} style={styles.image} /> //change this to the dynamic url that the ai spits out
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        {/* Food Name */}
        <Text style={styles.name}>{name}</Text>

        {/* Shelf Life */}
        <Text style={styles.shelfLife}>{shelfLife}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    margin: 8,
    width: 180,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  content: { alignItems: "center" },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
  },
  name: { fontSize: 20, fontWeight: "600", color: "#333", textAlign: "center" },
  shelfLife: { fontSize: 13, color: "green", marginTop: 4, textAlign: "center" },
});
