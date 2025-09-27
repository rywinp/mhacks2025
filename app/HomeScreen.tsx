import { useState } from "react";
import { Button, Image, Text, View } from "react-native";
import { supabase } from "./supabaseClient";

export default function HomeScreen() {
  const [imgurl, setimgurl] = useState("");

  // example of uploading a file
  // const { data, } = supabase.storage
  // .from('images')
  // .getPublicUrl('avatars/myImage.png');

  // console.log('Public URL:', data.publicUrl);

  const handleUpload = async () => {
    try {
      // 1. Load the image as a Blob
      const imageUri = require("../assets/images/icon.png");
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // 2. Upload to Supabase
      const { data, error } = await supabase.storage
        .from("Images")
        .upload("icon.png", blob, {
          contentType: "image/png",
          upsert: true,
        });

      if (error) throw error;

      // 3. Get public URL
      const { data: publicData } = supabase.storage
        .from("Images")
        .getPublicUrl("icon.png");
      console.log("Public URL:", publicData.publicUrl);
      setimgurl(publicData.publicUrl);
    } catch (e: any) {
      console.error(e);
    }
  };
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
      <Button title="Upload Logo" onPress={handleUpload} />
      <Image source={{ uri: imgurl }} style={{ width: 200, height: 200 }} />
      <Text>Welcome! You are logged in.</Text>
      <Button title="I will" onPress={() => {
        console.log(imgurl);
      }} />
    </View>
  );
}


