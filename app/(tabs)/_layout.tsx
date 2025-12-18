import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          borderTopWidth: 1,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#0c0c0c',
        },
        headerTintColor: '#fff',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Lojëra',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{
          title: 'Mundësi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missions',
          tabBarIcon: ({ color, size}) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mgm"
        options={{
          title: 'MGM',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="diamond" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="referral"
        options={{
          title: 'Referral',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="live-feed"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="radio" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      
      {/* Hidden screens - accessible via Profile menu */}
      <Tabs.Screen
        name="premium"
        options={{
          href: null,
          title: 'Premium',
        }}
      />
      <Tabs.Screen
        name="revenue-calc"
        options={{
          href: null,
          title: 'Earnings Calculator',
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          href: null,
          title: 'Transaksionet',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: 'Konfigurimet',
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          href: null,
          title: 'Suport',
        }}
      />
      <Tabs.Screen
        name="language"
        options={{
          href: null,
          title: 'Language',
        }}
      />
      <Tabs.Screen
        name="solana-wallet"
        options={{
          href: null,
          title: 'Solana Wallet',
        }}
      />
      <Tabs.Screen
        name="admin-panel"
        options={{
          href: null,
          title: 'Admin Panel',
        }}
      />
    </Tabs>
  );
}