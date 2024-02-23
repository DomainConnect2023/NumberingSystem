import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, SafeAreaView } from 'react-native';
import TabNavigationScreen from './screens/TabNavigation';
import RegisterScreen from './screens/RegisterPage';
import RegisterScreen2 from './screens/RegisterPage2';
import LoginScreen from './screens/LoginPage';
import DashboardScreen from './screens/DashboardPage';
import ViewImageScreen  from './screens/ViewImageScreen';
import ProfileScreen from './screens/ProfileScreen';
import Welcome from './screens/Welcome';
import { PaperProvider } from 'react-native-paper';
import whiteTheme from './objects/commonCSS';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  LogBox.ignoreAllLogs();
  
  return (
    <PaperProvider theme={whiteTheme}>
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
          <Stack.Screen name="TabNavigation" component={TabNavigationScreen} />
          <Stack.Screen name="ViewImageScreen" component={ViewImageScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="Welcome" component={Welcome} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
    </PaperProvider>
  );
}

export default App;