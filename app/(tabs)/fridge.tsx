import React, { useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  scrollTo,
} from "react-native-reanimated";
import FoodItem, { FoodItemProps } from "../../components/food-item.tsx";

const { width } = Dimensions.get("window");

const TABS = ["Fresh Goods", "Nearing Date", "Time to Toss"] as const;
type TabKey = typeof TABS[number];

const TAB_WIDTH = width / TABS.length;

const foodData: Record<TabKey, FoodItemProps[]> = {
  "Fresh Goods": [
    { name: "Apples", shelfLife: "5 days" },
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

export default function FridgeScreen() {
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [0, width, 2 * width],
      [0, TAB_WIDTH, 2 * TAB_WIDTH],
      Extrapolate.CLAMP
    );
    return { transform: [{ translateX }] };
  });

  const tabBackground: Record<TabKey, string> = {
    "Fresh Goods": "#d0f0c0",
    "Nearing Date": "#fff5b1",
    "Time to Toss": "#f8c8c8",
  };

  const getPages = (items: FoodItemProps[]) => {
    const pages: FoodItemProps[][] = [];
    for (let i = 0; i < items.length; i += 4) pages.push(items.slice(i, i + 4));
    return pages;
  };

  const handleTabPress = (index: number) => {
    scrollRef.current?.scrollTo({ x: width * index, y: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => handleTabPress(index)}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      </View>

      {/* Scrollable Pages */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {TABS.map((tab) => {
          const pages = getPages(foodData[tab]);
          return (
            <View key={tab} style={[styles.page, { backgroundColor: tabBackground[tab] }]}>
              <Text style={styles.pageTitle}>{tab}</Text>
              <FlatList
                data={pages}
                keyExtractor={(_, idx) => `${tab}-page-${idx}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: pageItems }) => (
                  <View style={styles.grid}>
                    {pageItems.map((food, idx) => (
                      <FoodItem key={`${food.name}-${idx}`} name={food.name} shelfLife={food.shelfLife} />
                    ))}
                  </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 12 }}
              />
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  page: { width, paddingTop: 20, alignItems: "center", paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#333" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  tab: { flex: 1, paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#333" },
  indicator: { position: "absolute", bottom: 0, height: 3, width: TAB_WIDTH, backgroundColor: "#2c3e50" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width - 40,
  },
});
