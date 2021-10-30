import 'react-native-gesture-handler';
import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from "./components/Home"
import { Platform } from "./components/Platform"
import { Settings } from "./components/Settings"
import { History } from "./components/History"
import { Search } from "./components/Search"
import { PlatformSettings } from "./components/Settings/Platform"
import { GeneralSettings } from "./components/Settings/General"
import { ThemeSettings } from "./components/Settings/Theme"

import { DbContextProvider } from "./hooks/useDb"
import { SettingsContextProvider } from "./hooks/useSettings"
import { KeyboardContextProvider } from "./hooks/keyboardHook"

import { RunLocalCommand } from "./modules/RunLocalCommand";


const App = () => {

  const Stack = createStackNavigator();


  useEffect(() => {

    // enable joystick on pandora box 3d+
    RunLocalCommand().startPlatformService()

  },[] )

  return (
    <DbContextProvider>
      <KeyboardContextProvider>

      <SettingsContextProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
            headerShown: false,
            
          }} >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Home' }}
            />
            <Stack.Screen name="Platform" component={Platform} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="PlatformSettings" component={PlatformSettings} />
            <Stack.Screen name="GeneralSettings" component={GeneralSettings} />
            <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
          </Stack.Navigator>
        </NavigationContainer>
      </SettingsContextProvider>
      </KeyboardContextProvider>
    </DbContextProvider>

  )

};

export default App;
