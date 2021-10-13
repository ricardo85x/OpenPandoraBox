import React  from 'react';
import { View } from 'react-native';

import { useSettingsContext } from "../../hooks/useSettings";

import { KeyBoard } from "./KeyBoard"

export const Body = ({ selectedGame, keyboardActiveRef, keyboardRef }) => {

    const { APP_HEIGHT } = useSettingsContext()

    return (
        <View style={{
            height: APP_HEIGHT - 50 - 60,
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column"
        }}>
            <KeyBoard selectedGame={selectedGame} keyboardActiveRef={keyboardActiveRef} ref={keyboardRef}  />
        </View>
    )
}