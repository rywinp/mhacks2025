import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { supabase } from '../hooks/supabaseClient';
import AuthInput from '../components/Auth.input';
import AuthButton from '../components/AuthButton';

export default function LoginScreen() {
  const router = useRouter(); // Expo Router hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      console.log('Sign up response:', data, error);
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link. Please verify your email before logging in.'
      );
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      Alert.alert('Success', 'You are logged in!');
      // Navigate to /newItem
      router.push('/(tabs)/app');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <AuthButton title="Sign Up" onPress={handleSignUp} />
      <AuthButton title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
  },
});
