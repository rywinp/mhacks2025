import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../hooks/supabaseClient';
const router = useRouter();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setLoading(false);
      };
      getSession();
  
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setLoading(false);
      });

      
  
      return () => listener.subscription.unsubscribe();
    }, []);

      useEffect(() => {
        if (!loading){
          if (!session) {
            console.log("SESSION from _layout.tsx: ");
            console.log(session);
            router.replace('/'); // Navigate to the main app if logged in
          }
        }
        }, [session, loading]);

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
          title: 'Fridge',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="refrigerator.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
