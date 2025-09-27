import { Button, Text, View } from "react-native";
import { supabase } from "./supabaseClient";

export default function HomeScreen() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome! You are logged in.</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
