import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { supabase } from '../hooks/supabaseClient';
import AuthInput from '../components/Auth.input';
import AuthButton from '../components/AuthButton';

export default function LoginScreen() {
  const router = useRouter();
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
        style={styles.input}
        placeholderTextColor="#888"
      />
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
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
    backgroundColor: '#ffffff', // ✅ white background
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000', // ✅ black text for contrast
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    color: '#000000', // ✅ black input text
  },
});
