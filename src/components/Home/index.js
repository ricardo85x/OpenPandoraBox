import React, { useEffect, useState, useRef, useReducer } from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {
    SafeAreaView,
    View,
    Text,
    StatusBar, Animated
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import KeyEvent from 'react-native-keyevent';

import { PandaConfig } from "../../utils/PandaConfig"
import { Header } from "./Header"
import { Item } from "../Home/Item"

import { useSettingsContext } from "../../hooks/useSettings"

export const HomeScreen = ({ navigation, route }) => {

    const { APP_WIDTH, APP_HEIGHT, keyMap } = useSettingsContext()
    const keyMapRef = useRef(keyMap)

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const animationSpeed = 400
    const animationOutSpeed = 100

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animationSpeed,
            useNativeDriver: true,
        }).start();
    }

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: animationOutSpeed,
            useNativeDriver: true
        }).start();
    }

    const slideLeftStyle = {
        transform: [
            {
                translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0]
                })
            }
        ]
    }
    const slideRightStyle = {
        transform: [
            {
                translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-600, 0]
                })
            }
        ]
    }

    const fadeoutStyle = {
        opacity: fadeAnim
    }

    const currentSlide = useRef(slideLeftStyle)
    const [_updateView, forceUpdate] = useReducer(x => x + 1, 0);
    const pandaConfig = PandaConfig();

    const [carousel, setCarousel] = useState({
        active: 0,
        items: [],
    })

    const carouselReRef = useRef({
        active: 0,
        items: [],
    });


    useEffect(() => {
        if (keyMap?.leftKeyCode) {
            keyMapRef.current = keyMap;
        }
    }, [keyMap])


    const loadConfig = async () => {
        const gameList = await pandaConfig.loadItemsMenu()
        carouselReRef.current = { ...carouselReRef.current, items: gameList }
        setCarousel(carouselReRef.current)
        fadeIn()
    }

    useEffect(() => {
        StatusBar.setHidden(true);
        loadConfig();

    }, [])

    const ListenKeyBoard = (keyEvent) => {

        if (keyMapRef.current.leftKeyCode?.includes(keyEvent.keyCode)) {
            currentSlide.current = slideLeftStyle
            // currentSlide.current = fadeoutStyle
            forceUpdate();
            fadeOut()

            if (carouselReRef.current.active > 0) {
                carouselReRef.current.active = carouselReRef.current.active - 1;
            } else {
                carouselReRef.current.active = carouselReRef.current.items.length - 1;
            }

            setTimeout(() => {
                setCarousel(carouselReRef.current)
                currentSlide.current = slideRightStyle
                forceUpdate();
                fadeIn()
            }, animationOutSpeed)
        }

        if (keyMapRef.current.rightKeyCode?.includes(keyEvent.keyCode)) {
            currentSlide.current = slideRightStyle
            // currentSlide.current = fadeoutStyle
            forceUpdate();
            fadeOut()

            if (carouselReRef.current.active < carouselReRef.current.items.length - 1) {
                carouselReRef.current.active = carouselReRef.current.active + 1;
            } else {
                carouselReRef.current.active = 0;
            }

            setTimeout(() => {
                setCarousel(carouselReRef.current)
                currentSlide.current = slideLeftStyle
                forceUpdate();
                fadeIn()
            }, animationOutSpeed)
        }

        if (keyMapRef.current.P1_A?.includes(keyEvent.keyCode)) {

            if (route.name == "Home") {

                const currentItem = carouselReRef.current.items[carouselReRef.current.active];

                if (currentItem.type === "settings") {

                    navigation.navigate('Settings')

                } else if (currentItem.type === "history") {

                    navigation.navigate('History', { keyMaps: keyMap })

                } else if (currentItem.type === "platform") {
                    navigation.navigate('Platform', { keyMaps: keyMap, platform: currentItem })
                }
            }
        }
    }

    useFocusEffect(
        React.useCallback(() => {

            KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
            loadConfig();

            return () => {
                KeyEvent.removeKeyDownListener();
            };

        }, [])
    );

    return (
        <SafeAreaView>

            <View style={{
                width: APP_WIDTH,
                height: APP_HEIGHT,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // justifyContent: "space-between",

            }}>

                <Header height={50} title={
                    carousel.items.length ?
                        carouselReRef.current.items[carouselReRef.current.active].title : ""
                } />

                <LinearGradient 

                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} 

                    colors={["#1A202C", "#2D3748", "#4A5568"]}  
                
                    style={{ 
                    display: "flex", 
                    height: (APP_HEIGHT - 50),
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "#4A5568"
                    
                }}>

{
                    carousel.items.length ?
                        <View style={{ 
                            display: "flex", 
                            height: (APP_HEIGHT - 50) - 20, 
                            flexDirection: 'row', 
                            justifyContent: 'center',
                            alignItems: "center",
                            // backgroundColor: "#4A5568",
                            width: "100%"
                            
                        }}>
                            <Animated.View
                                style={currentSlide.current}
                            >

                                <Item
                                    item={carouselReRef.current.items[carouselReRef.current.active]}
                                    navigation={navigation}
                                    currentIndex={carouselReRef.current.active}
                                    keyMaps={keyMap}
                                />

                            </Animated.View>

                        </View>


                        : <Text>Loading...</Text>
                }

                </LinearGradient>


                

            </View>
        </SafeAreaView>

    );

}

