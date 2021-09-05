import React, { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { Utils } from "../../../utils";

export const PlatformSettings = ({ navigation, route }) => {

    const { APP_WIDTH, APP_HEIGHT } = Utils()

    const { params: { keyMaps } } = route

    useEffect(() => {
        const loadSettings = async () => {
            // hack to ListenKeyBoard work
            await new Promise(resolve => setTimeout(resolve, 1000))
            KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
        }
        loadSettings()
    }, [])

    const handleSelection = () => {

    }

    const ListenKeyBoard = (keyEvent) => {

        if ([...keyMaps.P1_A, ...keyMaps.P2_A].includes(keyEvent.keyCode)) {
            handleSelection()
        }

        if (keyMaps.P1_B?.includes(keyEvent.keyCode)) {
            if (navigation.canGoBack()) {
                navigation.goBack()
                // console.log("BACK")
            } else {
                navigation.navigate('Home');
                // console.log("To the home")
            }
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
                        }}>SETTINGS</Text>
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
                                    backgroundColor: "#CBD5E0",
                                    margin: 10,
                                    borderColor: "#718096",
                                    borderWidth: 2,
                                    borderRadius: 10
                                }}
                            >
                                <View style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexWrap: "wrap",
                                    alignItems: "center",
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

                    <View style={{
                        width: "100%",
                        height: 80,

                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        backgroundColor: "#718096",
                        borderTopColor: "#ffff",
                        borderTopWidth: 1
                    }}>
                        <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: "white", borderRadius: 35 }}>
                            <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>A</Text>
                            <Text style={{ alignSelf: "center", fontWeight: "bold" }}>SELECT</Text>
                        </View>
                        <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: "yellow", borderRadius: 35 }}>
                            <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>B</Text>
                            <Text style={{ alignSelf: "center", fontWeight: "bold" }}>BACK</Text>
                        </View>
                        <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: "red", borderRadius: 35 }}>
                            <Text style={{ color: "white", alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>C</Text>
                            <Text style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}>PREV</Text>
                        </View>
                        <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: "green", borderRadius: 35 }}>
                            <Text style={{ color: "white", alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>F</Text>
                            <Text style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}>NEXT</Text>
                        </View>

                    </View>



                </View>

            </SafeAreaView>
        </>
    )
}


