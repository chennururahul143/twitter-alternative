import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import FeedScreen from './screens/FeedScreen';
import UsersScreen from './screens/UsersScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      >
        <Tab.Screen
          name="Feed"
          options={{
            title: '🐦 Feed',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>🏠</Text>
            ),
          }}
        >
          {(props) => <FeedScreen {...props} currentUserId={currentUserId} />}
        </Tab.Screen>

        <Tab.Screen
          name="Users"
          options={{
            title: '👥 Users',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>👥</Text>
            ),
          }}
        >
          {(props) => <UsersScreen {...props} currentUserId={currentUserId} />}
        </Tab.Screen>

        <Tab.Screen
          name="Notifications"
          options={{
            title: '🔔 Notifications',
            tabBarIcon: ({ color }) => (
              <View>
                <Text style={{ fontSize: 24 }}>🔔</Text>
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        >
          {(props) => (
            <NotificationsScreen
              {...props}
              currentUserId={currentUserId}
              onUnreadCountChange={setUnreadCount}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Profile"
          options={{
            title: '👤 Profile',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>👤</Text>
            ),
          }}
        >
          {(props) => (
            <ProfileScreen
              {...props}
              currentUserId={currentUserId}
              onUserChange={setCurrentUserId}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
});
