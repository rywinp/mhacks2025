import React from 'react';
import { View, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabaseClient';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();

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
    </View>
  );
}