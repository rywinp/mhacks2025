import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import FoodItem, { FoodItemProps } from "../../components/food-item.tsx";

const { width } = Dimensions.get("window");

const TABS = ["Fresh Goods", "Nearing Date", "Time to Toss"] as const;
type TabKey = typeof TABS[number];

const foodData: Record<TabKey, FoodItemProps[]> = {
  "Fresh Goods": [
    { name: "Apples", shelfLife: "5 days", image: "@/assets/images/Tung.png" },
    { name: "Carrots", shelfLife: "7 days" },
    { name: "Milk", shelfLife: "3 days" },
    { name: "Spinach", shelfLife: "2 days" },
    { name: "Eggs", shelfLife: "10 days" },
  ],
  "Nearing Date": [
    { name: "Yogurt", shelfLife: "1 day" },
    { name: "Cheese", shelfLife: "2 days" },
    { name: "Bread", shelfLife: "1 day" },
    { name: "Strawberries", shelfLife: "1 day" },
    { name: "Tomatoes", shelfLife: "2 days" },
  ],
  "Time to Toss": [
    { name: "Lettuce", shelfLife: "0 days" },
    { name: "Bananas", shelfLife: "0 days" },
    { name: "Avocados", shelfLife: "0 days" },
    { name: "Cucumbers", shelfLife: "0 days" },
    { name: "Mushrooms", shelfLife: "0 days" },
  ],
};

const TAB_COLORS: Record<TabKey, string> = {
  "Fresh Goods": "rgba(76,175,80,",    // green
  "Nearing Date": "rgba(255,165,0,",   // yellowish orange
  "Time to Toss": "rgba(255,59,48,",   // red
};

export default function FridgeScreen() {
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const getPages = (items: FoodItemProps[]) => {
    const pages: FoodItemProps[][] = [];
    for (let i = 0; i < items.length; i += 4) pages.push(items.slice(i, i + 4));
    return pages;
  };

  const handleTabPress = (index: number) => {
    scrollRef.current?.scrollTo({ x: width * index, y: 0, animated: true });
  };

  const handleAddFood = () => {
    Alert.alert("Add Food Item", "This will open the add food item flow.");
  };

  return (
    <View style={styles.container}>
      {/* Header with App Name */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>  Terava</Text>
        <View style={styles.floatingTabBar}>
          {TABS.map((tab, index) => {
            const animatedStyle = useAnimatedStyle(() => {
              const isActive = interpolate(
                scrollX.value,
                [(index - 0.5) * width, index * width, (index + 0.5) * width],
                [0, 1, 0],
                Extrapolate.CLAMP
              );
              return {
                backgroundColor: `${TAB_COLORS[tab]}${isActive})`,
              };
            });

            const animatedTextStyle = useAnimatedStyle(() => {
              const isActive = interpolate(
                scrollX.value,
                [(index - 0.5) * width, index * width, (index + 0.5) * width],
                [0, 1, 0],
                Extrapolate.CLAMP
              );
              return {
                color: isActive > 0.5 ? "#fff" : "#333",
              };
            });

            return (
              <Animated.View key={tab} style={[styles.tab, animatedStyle]}>
                <TouchableOpacity onPress={() => handleTabPress(index)}>
                  <Animated.Text style={[styles.tabText, animatedTextStyle]}>
                    {tab}
                  </Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Scrollable Pages */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 160, paddingBottom: 100 }}
      >
        {TABS.map((tab) => {
          const pages = getPages(foodData[tab]);
          return (
            <View key={tab} style={styles.page}>
              <FlatList
                data={pages}
                keyExtractor={(_, idx) => `${tab}-page-${idx}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: pageItems }) => (
                  <View style={styles.grid}>
                    {pageItems.map((food, idx) => (
                      <FoodItem
                        key={`${food.name}-${idx}`}
                        name={food.name}
                        shelfLife={food.shelfLife}
                        image={food.image}
                      />
                    ))}
                  </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 12 }}
              />
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Add Food Item Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddFood} activeOpacity={0.8}>
        <Text style={styles.addButtonText}>+ Add Food Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  floatingTabBar: {
    flexDirection: "row",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "#f0f0f0", // light grey
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    borderRadius: 30,
  },
  tabText: { fontSize: 16, fontWeight: "600" },
  page: { width, paddingTop: 20, alignItems: "center", paddingBottom: 40 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width - 40,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
