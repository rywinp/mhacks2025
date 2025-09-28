import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Button, View } from 'react-native';
import { supabase } from './supabaseClient';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.log('Error logging in:', error.message);
      return;
    }

    // Opens a browser for Google login
    if (data.url) {
      // This automatically opens Expo AuthSession
      window.location.href = data.url; // works in web
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login with Google" onPress={handleGoogleLogin} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}