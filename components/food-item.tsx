import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export type FoodItemProps = {
  name: string;
  shelfLife: string;
  //add image item
};

export default function FoodItem({ name, shelfLife }: FoodItemProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.shelfLife}>{shelfLife}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 300,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  shelfLife: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});
