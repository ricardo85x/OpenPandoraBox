import React from 'react';
import { View } from 'react-native';

import { useSettingsContext } from "../../hooks/useSettings";
import { Body } from "./Body"
import { Header } from "./Header"
import { Footer } from "../Footer"

export const Main = ({ keyboardActiveRef, keyboardRef, selectedGame, onBackground, buttonAction }) => {

    const { APP_WIDTH, APP_HEIGHT } = useSettingsContext()



    const footItems = keyboardActiveRef?.current ?
    [
        { title: "A", text: "SELECT" },
        { title: "B", text: "DEL" },
        { title: "C", text: "SPACE" },

    ] :
    [
        { title: "A", text: "SELECT" },
        { title: "B", text: "BACK" },
        { title: "C", text: "PREV" },
        { title: "F", text: "NEXT" }
    ]

    return (

        <View style={{
            height: APP_HEIGHT,
            width: APP_WIDTH * 0.65,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column"
        }}>
            <Header romName={selectedGame?.romName} title={selectedGame?.platformTitle} gameName={selectedGame?.name} />
            <Body selectedGame={selectedGame} keyboardActiveRef={keyboardActiveRef} keyboardRef={keyboardRef} onBackground={onBackground} selectedGame={selectedGame} />
            <Footer
                buttonAction={buttonAction}
                items={footItems}
            />
        </View>
    )
}
