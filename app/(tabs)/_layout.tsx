import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
const router = useRouter();

  
export default function TabLayout() {
  const colorScheme = useColorScheme();
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
        if (!session) {
          router.replace('/loginScreen'); // Navigate to the main app if logged in
        }
      }, [session]);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
