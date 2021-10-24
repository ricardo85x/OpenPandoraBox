import React  from 'react';
import { View, Text } from 'react-native';

import { useSettingsContext } from "../../hooks/useSettings";
import { MediaPreview } from "./MediaPreview"

import { KeyBoard } from "./KeyBoard"
import { IRomSearch } from '../../utils/types';
import { RefAttributes } from 'react';

interface BodyProps {
    onBackground: boolean;
    selectedGame: IRomSearch | undefined
    keyboardActiveRef: RefAttributes<any>
    keyboardRef: any
    
}

export const Body = ({ onBackground, selectedGame, keyboardActiveRef, keyboardRef } : BodyProps) => {

    const { APP_HEIGHT, APP_WIDTH } = useSettingsContext()

    return (
        <View style={{
            height: APP_HEIGHT - 50 - 50,
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column"
        }}>

            <Text style={{
                color: 'white',
                width: APP_WIDTH * 0.65,
                paddingStart: 10,
                overflow: "hidden",
                fontSize: 13,
                flex: 1
                }}>{selectedGame?.romName}</Text>

        <MediaPreview 
            selectedGame={selectedGame} 
            APP_HEIGHT={APP_HEIGHT} 
            onBackground={onBackground}
            
        /> 

            <KeyBoard keyboardActiveRef={keyboardActiveRef} ref={keyboardRef}  />
        </View>
    )
}