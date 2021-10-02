import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from "./components/Home"
import { Platform } from "./components/Platform"
import { Settings } from "./components/Settings"
import { History } from "./components/History"
import { PlatformSettings } from "./components/Settings/Platform"
import { GeneralSettings } from "./components/Settings/General"

import { DbContextProvider } from "./hooks/useDb"
import { SettingsContextProvider } from "./hooks/useSettings"


const App = () => {

  const Stack = createStackNavigator();

  return (
    <DbContextProvider>
      <SettingsContextProvider>
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
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="PlatformSettings" component={PlatformSettings} />
            <Stack.Screen name="GeneralSettings" component={GeneralSettings} />
          </Stack.Navigator>
        </NavigationContainer>
      </SettingsContextProvider>
    </DbContextProvider>

  )

};

export default App;
