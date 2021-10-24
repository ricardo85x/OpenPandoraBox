import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IRomSearch } from '../../utils/types';

interface GameItemProps {
    keyboardActiveRef: any
    game: IRomSearch
    EXTRA_SPACE: number
}

export const GameItem = ({ keyboardActiveRef, game, EXTRA_SPACE }: GameItemProps) => {

    const height = (game?.selected && EXTRA_SPACE) ? ((50) + EXTRA_SPACE) : 50

    let bgColor = ["#171923", "#1A202C", "#2D3748"]
   
    if (game?.selected) {        
        bgColor = keyboardActiveRef?.current ? ['#A0AEC0', '#718096', '#4A5568'] : ['#A0AEC0', '#718096', '#4A5568']
    } else {
        if (game.id % 2 === 0) {
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
            }}>
            <Text style={{
                fontSize: 17,
                flex: 1,
                textAlignVertical: "center",

                color: '#ffff',
                overflow: "hidden",

            }}>{game.name}</Text>

        </LinearGradient>
    )
}