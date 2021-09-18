import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { useSettingsContext } from "../../hooks/useSettings";

import { Footer } from "./Footer"

export const Settings = ({ navigation, route }) => {


    const { APP_WIDTH, APP_HEIGHT, keyMap } = useSettingsContext()


    const defaultSettings = {
        active: 0,
        items: [
            { key: "directory", name: "Directories", desc: "Directory/Folder settings", index: 0 },
            { key: "platform", name: "Platforms", desc: "Add/Edit/Remove platforms ", index: 1 },
        ]
    }

    const settingsRef = useRef(defaultSettings)
    const [settings, setSettings] = useState(defaultSettings)




    useEffect(() => {
        const loadSettings = async () => {
            // hack to ListenKeyBoard work
            await new Promise(resolve => setTimeout(resolve, 100))
            KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
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
            } else if (selectedItem.key === "directory") {
                navigation.push('DirectorySettings')
            }
        }
    }

    const ListenKeyBoard = (keyEvent) => {

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
            KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
            return () => {
                KeyEvent.removeKeyDownListener();
            };
        }, [])
    );

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
                    <View style={{
                        height: 70,
                        backgroundColor: "#718096"

                    }}>
                        <Text style={{
                            margin: "auto",
                            fontSize: 40, fontWeight: "bold", color: "white"
                        }}> SETTINGS</Text>
                    </View>

                    <View style={{
                        height: APP_HEIGHT - 150,
                        display: "flex",
                        flexDirection: "row"

                    }}
                    >

                        {settings.items.map(item => (
                            <View key={item.index}
                                style={{
                                    width: 200,
                                    height: 140,
                                    backgroundColor: settings.active === item.index ? "#CBD5E0" : "#A0AEC0",
                                    margin: 10,
                                    borderColor: settings.active === item.index ? "black" : "#718096",
                                    borderWidth: 2,
                                    borderRadius: 10
                                }}
                            >
                                <View style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    height: 40,
                                    backgroundColor: "#4A5568"

                                }}>
                                    <Text style={{
                                        margin: "auto",
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        color: "white"
                                    }}>{item.name}</Text>

                                </View>
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

                    </View>

                    <Footer />



                </View>

            </SafeAreaView>
        </>
    )
}


