// FridgeScreen.tsx
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler, useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import FoodItem, { FoodItemProps } from "../../components/food-item.tsx";
import * as API from '../../hooks/supabaseFront';

const { width } = Dimensions.get("window");

const TABS = ["Fresh Goods", "Nearing Date", "Time to Toss"] as const;
//type TabKey = typeof TABS[number];

// const { data, error } = await supabase.auth.getUser()

// if (error) {
//   console.error(error)
// } else {
//   const user = data.user
//   const userId = user?.id  // this is the uuid you want
//   console.log("User ID:", userId)
// }


// const foodData: Record<TabKey, FoodItemProps[]> = {
//   "Fresh Goods": [
//     { name: "Apples", shelfLife: "5 days", image: require('../../assets/images/Tung.png') },
//     { name: "Carrots", shelfLife: "7 days" },
//     { name: "Milk", shelfLife: "3 days" },
//     { name: "Spinach", shelfLife: "2 days" },
//     { name: "Eggs", shelfLife: "10 days" },
//   ],
//   "Nearing Date": [
//     { name: "Yogurt", shelfLife: "1 day" },
//     { name: "Cheese", shelfLife: "2 days" },
//     { name: "Bread", shelfLife: "1 day" },
//     { name: "Strawberries", shelfLife: "1 day" },
//     { name: "Tomatoes", shelfLife: "2 days" },
//   ],
//   "Time to Toss": [
//     { name: "Lettuce", shelfLife: "0 days" },
//     { name: "Bananas", shelfLife: "0 days" },
//     { name: "Avocados", shelfLife: "0 days" },
//     { name: "Cucumbers", shelfLife: "0 days" },
//     { name: "Mushrooms", shelfLife: "0 days" },
//   ],
// };

const TAB_COLORS: Record<API.TabKey, string> = {
  "Fresh Goods": "rgba(76,175,80,",    // green
  "Nearing Date": "rgba(255,165,0,",   // yellowish orange
  "Time to Toss": "rgba(255,59,48,",   // red
};

export default function FridgeScreen() {
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);


  const [foodData, setFoodData] = useState<Record<API.TabKey, FoodItemProps[]>>({
  "Fresh Goods": [],
  "Nearing Date": [],
  "Time to Toss": [],
});

  useEffect(() => {

    async function fetchFoods() {
      try {
        const userid = await API.getCurrentUserId();
        if (!userid) {
          console.error("No user logged in");
          return;
        }

        const foods = await API.getFoodsByUser(userid).then(API.processFoods);
        setFoodData(foods);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setFoodData({
          "Fresh Goods": [],
          "Nearing Date": [],
          "Time to Toss": [],
        });
      }
    }

    // async function insertSampleFoods() {
    //   const userid = await API.getCurrentUserId();
    //   if (!userid) {
    //     console.error("No user logged in");
    //     return;
    //   }
    //   API.insertFoods([
    //   { name: "Apples", daysUntilExpire: 5, user_id: userid },
    //   { name: "Carrots", daysUntilExpire: 7, user_id: userid },
    //   { name: "Milk", daysUntilExpire: 3, user_id: userid },
    //   { name: "Spinach", daysUntilExpire: 2, user_id: userid},
    //   { name: "Eggs", daysUntilExpire: 10, user_id: userid},
    //   ]);
    // }

    // // Uncomment the next line to insert sample foods on first run    
    // insertSampleFoods();
    fetchFoods();
  }, []);


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

  const handleLogout = async () => {
    console.log(foodData);
    //tmp
    //await supabase.auth.signOut();
  };

  const handleAddFood = () => {
    Alert.alert("Add Food Item", "This will open the add food item flow.");
  };

  // Animated background style
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      [0, width, 2 * width],
      ['rgba(76,175,80,0.2)', 'rgba(255,165,0,0.2)', 'rgba(255,59,48,0.2)']
    );
    return { backgroundColor };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Animated Background */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundStyle]} />

      {/* Main Content */}
      <View style={styles.container}>
        <Button title="Logout" onPress={handleLogout} />

        {/* Header with App Name */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Terava</Text>
          <View style={styles.floatingTabBar}>
            {TABS.map((tab, index) => {
              const animatedStyle = useAnimatedStyle(() => {
                const isActive = scrollX.value >= index * width - width / 2 && scrollX.value <= index * width + width / 2 ? 1 : 0;
                return {
                  backgroundColor: `${TAB_COLORS[tab]}${isActive})`,
                };
              });

              const animatedTextStyle = useAnimatedStyle(() => {
                const isActive = scrollX.value >= index * width - width / 2 && scrollX.value <= index * width + width / 2 ? 1 : 0;
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
        <Link href="/newItem" asChild>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
            <Text style={styles.addButtonText}>+ Add Food Item</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" }, // keep transparent so background shows
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
    backgroundColor: "#f0f0f0",
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
    color: "#fff",}})
