import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashboardScreen from './DashboardPage';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            } else if (route.name === 'Dashboardtest') {
              iconName = focused ? 'eye-outline' : 'eye-off-outline';
            } 

            return <Ionicons  name={iconName ?? ""} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen options={{ unmountOnBlur: true, }} name="Dashboard" component={DashboardScreen} />
        {/* <Tab.Screen options={{ unmountOnBlur: true, }} name="Dashboardtest" component={DashboardtestScreen} /> */}
      </Tab.Navigator>
  );
}

export default TabNavigation;
