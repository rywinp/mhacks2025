import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import LoginScreen from './loginScreen';
import { supabase } from './supabaseClient';

const Stack = createNativeStackNavigator();
const router = useRouter();
export default function index() {
  console.log("SESSION: ");
  
  const [session, setSession] = useState<any>(null);
  console.log(session);
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("SESSION CHANGED: ");
      console.log(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      router.replace('/(tabs)/app'); // Navigate to the main app if logged in
    };
    console.log("SESSION: ");
    console.log(session);
  }, [session]);

  return (
      <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
  );
}