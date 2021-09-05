import React from 'react';
import { View } from 'react-native';

import {Utils} from "../../utils";
import { Body } from "./Body"
import { Header } from "./Header"
import { Footer } from "./Footer"

export const Main = ({title, selectedGame, onBackground}) => {

    const { APP_WIDTH, APP_HEIGHT } = Utils()

    return (

        <View style={{
            height: APP_HEIGHT,
            width: APP_WIDTH * 0.65,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column"
        }}>
            <Header title={title} gameName={selectedGame?.name} />
            <Body onBackground={onBackground} selectedGame={selectedGame} />
            <Footer />
        </View>
    )
}
