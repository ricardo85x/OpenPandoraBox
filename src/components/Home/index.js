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
import { CarouselItem } from "../Home/CarouselItem"

import { Utils } from "../../utils"

export const HomeScreen = ({ navigation, route }) => {

    const { APP_HEIGHT, APP_WIDTH  } = Utils()

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const pandaConfig = PandaConfig();

    const [keyMaps, setKeyMaps] = useState({})
    const keyMapsRef = useRef({});
    const [carousel, setCarousel] = useState({
        active: 0,
        items: [],
    })

    const carouselReRef = useRef({
        active: 0,
        items: [],
    });


    const loadConfig = async () => {

        keyMapsRef.current = await pandaConfig.keyMapConfig()
        setKeyMaps(keyMapsRef.current)
        const gameslist = await pandaConfig.loadItemsMenu()

        carouselReRef.current = { ...carouselReRef.current, items: gameslist }
        setCarousel(carouselReRef.current)
        forceUpdate()
    }

    useEffect(() => {
        StatusBar.setHidden(true);
        loadConfig();

    }, [])

    const ListenKeyBoard = (keyEvent) => {

        if (keyMapsRef.current.leftKeyCode?.includes(keyEvent.keyCode)) {

            if (carouselReRef.current.active > 0) {
                carouselReRef.current.active = carouselReRef.current.active - 1;
            } else {
                carouselReRef.current.active = carouselReRef.current.items.length - 1; 
            }
            setCarousel(carouselReRef.current)
            forceUpdate();
        }

        if (keyMapsRef.current.rightKeyCode?.includes(keyEvent.keyCode)) {
            if (carouselReRef.current.active < carouselReRef.current.items.length - 1) {
                carouselReRef.current.active = carouselReRef.current.active + 1;
            } else {
                carouselReRef.current.active = 0;
            }
            setCarousel(carouselReRef.current);
            forceUpdate();
        }

        if (keyMapsRef.current.P1_A?.includes(keyEvent.keyCode)) {

            if (route.name == "Home") {


                const currentItem = carouselReRef.current.items[carouselReRef.current.active];
                
                if (currentItem.type === "settings"){

                    navigation.navigate('Settings', { keyMaps: keyMapsRef.current })

                } else if (currentItem.type === "History"){

                    navigation.navigate('History', { keyMaps: keyMapsRef.current })

                } else if (currentItem.type === "platform"){
                    navigation.navigate('Platform', { keyMaps: keyMapsRef.current, platform: currentItem })
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
                            <CarouselItem
                                item={carouselReRef.current.items[carouselReRef.current.active]}
                                navigation={navigation}
                                currentIndex={carouselReRef.current.active}
                                keyMaps={keyMapsRef.current}
                            />

                        </View>
                        : <Text>Loading...</Text>
                }
            </View>
        </SafeAreaView>

    );

}

