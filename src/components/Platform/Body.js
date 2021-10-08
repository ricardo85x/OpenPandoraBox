import React  from 'react';
import { Text, View } from 'react-native';

import { useSettingsContext } from "../../hooks/useSettings";

import { MediaPreview } from "./MediaPreview"

export const Body = ({ selectedGame, onBackground }) => {

    const { APP_WIDTH, APP_HEIGHT } = useSettingsContext()


    return (
        <View style={{
            height: APP_HEIGHT * 0.7,
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column"
        }}>

            {selectedGame && !!selectedGame?.image &&
                <MediaPreview 
                    selectedGame={selectedGame} 
                    APP_WIDTH={APP_WIDTH} 
                    APP_HEIGHT={APP_HEIGHT} 
                    onBackground={onBackground}
                /> 
            }
            <Text style={{
                width: (APP_WIDTH * 0.65) - 20,
                alignSelf: "center",
                color: '#EDF2F7',
                fontWeight: 'bold',
                overflow: "hidden",
                paddingTop: 5,
                textAlign: "center"
            }} >
                {selectedGame?.romName}
            </Text>

            {!!selectedGame?.desc && (
                <Text style={{
                    width: (APP_WIDTH * 0.65) - 20,
                    alignSelf: "center",
                    color: '#E2E8F0',
                    overflow: "hidden",
                    paddingTop: 5,
                    textAlign: "center"
                }} >
                    {selectedGame.desc}
                </Text>
            )}

        </View>
    )
}