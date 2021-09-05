import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from "./components/Home"
import { Platform } from "./components/Platform"
import { Settings } from "./components/Settings"
import { PlatformSettings } from "./components/Settings/Platform"
import { DirectorySettings } from "./components/Settings/Directory"

import { DbContextProvider } from "./hooks/useDb"


const App = () => {

  const Stack = createStackNavigator();

  return (
    <DbContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          initialRouteName: "Home"
        }} >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Stack.Screen name="Platform" component={Platform} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="PlatformSettings" component={PlatformSettings} />
          <Stack.Screen name="DirectorySettings" component={DirectorySettings} />
        </Stack.Navigator>
      </NavigationContainer>
    </DbContextProvider>

  )

};

export default App;
