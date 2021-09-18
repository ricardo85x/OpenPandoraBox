import React, { useEffect, useState, useRef, useReducer } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import KeyEvent from 'react-native-keyevent';

import { PandaConfig } from "../../utils/PandaConfig"
import { Header } from "../Header"
import { Item } from "../Home/Item"

import { useSettingsContext } from "../../hooks/useSettings"

export const HomeScreen = ({ navigation, route }) => {

    const { APP_WIDTH, APP_HEIGHT, keyMap } = useSettingsContext()

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const pandaConfig = PandaConfig();

    const [carousel, setCarousel] = useState({
        active: 0,
        items: [],
    })

    const carouselReRef = useRef({
        active: 0,
        items: [],
    });


    const loadConfig = async () => {

        const gameList = await pandaConfig.loadItemsMenu()

        carouselReRef.current = { ...carouselReRef.current, items: gameList }
        setCarousel(carouselReRef.current)
        forceUpdate()
    }

    useEffect(() => {
        StatusBar.setHidden(true);
        loadConfig();

    }, [])

    const ListenKeyBoard = (keyEvent) => {

        if (keyMap.leftKeyCode?.includes(keyEvent.keyCode)) {

            if (carouselReRef.current.active > 0) {
                carouselReRef.current.active = carouselReRef.current.active - 1;
            } else {
                carouselReRef.current.active = carouselReRef.current.items.length - 1; 
            }
            setCarousel(carouselReRef.current)
            forceUpdate();
        }

        if (keyMap.rightKeyCode?.includes(keyEvent.keyCode)) {
            if (carouselReRef.current.active < carouselReRef.current.items.length - 1) {
                carouselReRef.current.active = carouselReRef.current.active + 1;
            } else {
                carouselReRef.current.active = 0;
            }
            setCarousel(carouselReRef.current);
            forceUpdate();
        }

        if (keyMap.P1_A?.includes(keyEvent.keyCode)) {

            if (route.name == "Home") {


                const currentItem = carouselReRef.current.items[carouselReRef.current.active];
                
                if (currentItem.type === "settings"){

                    navigation.navigate('Settings')

                } else if (currentItem.type === "History"){

                    navigation.navigate('History', { keyMaps: keyMap })

                } else if (currentItem.type === "platform"){
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
                justifyContent: "space-between",
                
            }}>

                <Header height={APP_HEIGHT*0.1}  title={
                    carousel.items.length ?
                    carouselReRef.current.items[carouselReRef.current.active].title : ""
                } />

                {
                    carousel.items.length ?
                        <View style={{ display: "flex", height: (APP_HEIGHT * 0.9) - 20, flexDirection: 'row', justifyContent: 'center' }}>
                            <Item
                                item={carouselReRef.current.items[carouselReRef.current.active]}
                                navigation={navigation}
                                currentIndex={carouselReRef.current.active}
                                keyMaps={keyMap}
                            />

                        </View>
                        : <Text>Loading...</Text>
                }
            </View>
        </SafeAreaView>

    );

}

