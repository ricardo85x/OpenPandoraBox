import React from 'react';
import { View } from 'react-native';

import {useSettingsContext} from "../../hooks/useSettings";
import { Body } from "../Platform/Body"
import { Header } from "../Platform/Header"
import { Footer } from "../Footer"

interface MainProps {
    selectedGame: any
    onBackground: boolean
    buttonAction: (...args: any[]) => void

}

export const Main = ({selectedGame, onBackground, buttonAction}: MainProps) => {

    const { APP_WIDTH, APP_HEIGHT } = useSettingsContext()

    return (

        <View style={{
            height: APP_HEIGHT,
            width: APP_WIDTH * 0.65,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column"
        }}>
            <Header defaultTitle={"History"}  title={selectedGame?.platformTitle} gameName={selectedGame?.name} />
            <Body onBackground={onBackground} selectedGame={selectedGame} />
            <Footer 
                buttonAction={buttonAction}
                items={[
                    { title: "A", text: "SELECT"},
                    { title: "B", text: "BACK"},
                    { title: "D", text: "REMOVE"},
                    { title: "F", text: "FAV."}
                ]}
            />
        </View>
    )
}
