import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashboardScreen from './DashboardPage';
import SettingScreen from './SettingPage';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Setting') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons  name={iconName ?? ""} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen options={{ unmountOnBlur: true, }} name="Dashboard" component={DashboardScreen} />
        <Tab.Screen options={{ unmountOnBlur: true, }} name="Setting" component={SettingScreen} />
      </Tab.Navigator>
  );
}

export default TabNavigation;
