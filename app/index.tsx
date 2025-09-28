import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import LoginScreen from '../components/loginScreen';
import { supabase } from '../hooks/supabaseClient';

const Stack = createNativeStackNavigator();
const router = useRouter();
export default function index() {
  
  const [session, setSession] = useState<any>(null);
 
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      console.log("SESSION from _layout.tsx: ");
      console.log(session);
      router.replace('/(tabs)'); // Navigate to the main app if logged in
    }
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