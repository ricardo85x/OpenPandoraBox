import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { useSettingsContext } from "../../hooks/useSettings";
import LinearGradient from 'react-native-linear-gradient';

import { Footer } from "../Footer"
import { Header } from "./Header"
import { StackNavigationProp } from '@react-navigation/stack';
import { IKeyEvent } from '../../utils/types';

interface SettingsProps {
    navigation: StackNavigationProp<any,any>
}


export const Settings = ({ navigation } : SettingsProps ) => {


    const { APP_WIDTH, APP_HEIGHT, keyMap, themeColor, chakraColors } = useSettingsContext()



    const defaultSettings = {
        active: 0,
        items: [
            { key: "general", name: "General", desc: "Directory/Folder settings", index: 0 },
            { key: "platform", name: "Platforms", desc: "Add/Edit/Remove platforms ", index: 1 },
            { key: "theme", name: "Theme", desc: "Theme settings", index: 2 },
        ]
    }

    const settingsRef = useRef(defaultSettings)
    const [settings, setSettings] = useState(defaultSettings)

    useEffect(() => {
        const loadSettings = async () => {
            await new Promise(resolve => setTimeout(resolve, 100))
        
            KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) => ListenKeyBoard(keyEvent));
        }
        loadSettings()
    }, [])

 

    const handleSelection = () => {

        const selectedItem = settingsRef.current.items.find(
            item => item.index === settingsRef.current.active
        )

        if (!!selectedItem) {
            if (selectedItem.key === "platform") {
                navigation.push('PlatformSettings')
            } else if (selectedItem.key === "general") {
                navigation.push('GeneralSettings')
            } else if (selectedItem.key === "theme") {
                navigation.push('ThemeSettings')
            }
        }
    }

    const ListenKeyBoard = (keyEvent: IKeyEvent) => {

        if ([...keyMap.P1_A, ...keyMap.P2_A].includes(keyEvent.keyCode)) {
            handleSelection()
        }

        if (keyMap.P1_B?.includes(keyEvent.keyCode)) {
            if (navigation.canGoBack()) {
                navigation.goBack()
                // console.log("BACK")
            } else {
                navigation.navigate('Home');
                // console.log("To the home")
            }
        }

        if (keyMap.leftKeyCode?.includes(keyEvent.keyCode)) {
            handleNavigation("LEFT")
        }

        if (keyMap.rightKeyCode?.includes(keyEvent.keyCode)) {
            handleNavigation("RIGHT")
        }


    }


    const handleNavigation = ( direction = "") => {

        switch(direction) {
          case "LEFT":

            settingsRef.current = {
                ...settingsRef.current, 
                active: 
                    settingsRef.current.active > 0 ? 
                    settingsRef.current.active  - 1 : 
                    (settingsRef.current.items.length - 1)
              }
            setSettings(settingsRef.current)
  
            break;
          case "RIGHT":

            settingsRef.current = {
                ...settingsRef.current, 
                active: 
                  (settingsRef.current.active >= (settingsRef.current.items.length - 1)) ? 
                    0 : 
                    settingsRef.current.active + 1
              }

            setSettings(settingsRef.current)
  
            break;
          default:
            break
        }
    }

    

    useFocusEffect(
        React.useCallback(() => {
            KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) => ListenKeyBoard(keyEvent));
            return () => {
                KeyEvent.removeKeyDownListener();
            };
        }, [])
    );

    const buttonAction = (buttonName: string) => {

        switch (buttonName) {
            case "A":
                handleSelection();
                break;
            case "B":
                if (navigation.canGoBack()) {
                    navigation.goBack()
                } else {
                    navigation.navigate('Home');
                }
                break;
            default:
                break;
        }


    }

    return (
        <>
            <SafeAreaView>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: "column",
                        width: APP_WIDTH,
                        height: APP_HEIGHT,

                    }}
                >
                    <Header title="Settings" />
            




                    <LinearGradient 

                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} 

                        colors={["#1A202C", "#2D3748", "#4A5568"]}  
                    
                        style={{
                        height: APP_HEIGHT - 100,
                        display: "flex",
                        flexDirection: "row"

                    }}
                    >

                        {settings.items.map(item => (
                            <View key={item.index}
                                style={{
                                    width: 170,
                                    height: 140,
                                    backgroundColor: settings.active === item.index ? chakraColors.gray[0]  : chakraColors.gray[1] ,
                                    margin: 5,
                                    borderColor: settings.active === item.index ? themeColor[7] : "black",
                                    borderWidth: settings.active === item.index ? 4 : 2,
                                    // borderRadius: 10
                                }}
                            >
                                <LinearGradient 
                                
                                    colors={[chakraColors.gray[3], chakraColors.gray[4], chakraColors.gray[5]]}
                                
                                    style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    height: 40,

                                }}>
                                    <Text style={{
                                        margin: "auto",
                                        fontSize: settings.active === item.index ? 25: 20,
                                        fontWeight: settings.active === item.index ? "bold" : "400",
                                        color: "white"
                                    }}>{item.name}</Text>

                                </LinearGradient>
                                <View style={{
                                    height: 100
                                }}>

                                    <Text style={{
                                        textAlign: "center",
                                        lineHeight: 20,
                                        fontSize: 15,
                                        fontWeight: "bold",

                                        margin: "auto",
                                        padding: 10

                                    }}>{item.desc}</Text>

                                </View>




                            </View>
                        ))}

                    </LinearGradient>

          
                    <Footer 
                        buttonAction={buttonAction}
                        items={[
                            {color: "white", title: "A", text: "SELECT"},
                            {color: "yellow", title: "B", text: "BACK"} 
                    ]} />



                </View>

            </SafeAreaView>
        </>
    )
}


