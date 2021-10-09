import React from 'react';
import { View } from 'react-native';

import { useSettingsContext } from "../../hooks/useSettings";

import { Body } from "./Body"
import { Header } from "./Header"
import { Footer } from "../../components/Footer/index"

export const Main = ({title, selectedGame, onBackground, buttonAction}) => {

    const { APP_WIDTH, APP_HEIGHT } = useSettingsContext()

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
            {/* <Footer /> */}

            <Footer
                buttonAction={buttonAction}
                items={[
                {color: "white", title: "A", text: "SELECT"},
                {color: "yellow", title: "B", text: "BACK"},
                {color: "pink", title: "D", text: "RELOAD"},
                {color: "blue", title: "E", text: "RANDOM"},
                {color: "red", title: "C", text: "PREV"},
                {color: "green", title: "F", text: "NEXT"}
            ]}
          />
        </View>
    )
}
