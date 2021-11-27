import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IRomPlatform } from '../../utils/types';

import {useSettingsContext } from "../../hooks/useSettings"

interface GameItemProps {
    game: IRomPlatform
    EXTRA_SPACE: number
}

export const GameItem = ({ game, EXTRA_SPACE }: GameItemProps) => {

    const {chakraColors } = useSettingsContext()

    const height = (game?.selected && EXTRA_SPACE) ? ((50) + EXTRA_SPACE) : 50

    let bgColor = ["#171923", "#1A202C", "#2D3748"]
   
    if (game?.selected) {        
        bgColor = ['#A0AEC0', '#616468', '#4A5568']
    } else {
        if (game.id! % 2 === 0) {
            bgColor = ["#1A202C", "#2D3748", "#4A5568"]
        }
    }

    return (

        <LinearGradient

            start={{x: 0, y: 0}} end={{x: 1, y: 0}} 

            colors={bgColor}

            
            style={{
                justifyContent: "center",
                height: height - 4,
                marginVertical: 2,
                marginHorizontal: 2,
                borderWidth: 1,
                borderLeftWidth: 3,
                borderLeftColor: game?.favorite ? chakraColors.yellow[3] : "transparent",
            }}>
            <Text style={{
                fontSize: 17,
                flex: 1,
                textAlignVertical: "center",
             
                marginLeft: 5,
                color: '#ffff',
                overflow: "hidden",
            }}>{game.name}</Text>

        </LinearGradient>
    )
}