import React from 'react';
import { Text, View } from 'react-native';

export const GameItem = ({ game, APP_HEIGHT, EXTRA_SPACE }) => {

    const height = (game?.selected && EXTRA_SPACE) ? ((50) + parseInt(EXTRA_SPACE)) : 50

    if (game?.selected) {
        console.log("EXTRA_SPACE", EXTRA_SPACE)
        console.log("APP_HEIGHT", APP_HEIGHT)
    }

    return (

        <View

            style={{
                justifyContent: "center",
                height: height,
                borderWidth: 1,
                backgroundColor: game.selected ?
                    // "#4A5568" :
                    "#DD6B20" :
                    // "#ED8936" :
                    game.id % 2 === 0 ? "#080808" : "#181818"
                // game.id % 2 === 0 ? "#FBD38D" : "#FEEBC8"
                // game.id % 2 === 0 ? "#A0AEC0" : "#CBD5E0"

            }}>
            <Text style={{

                // color: game.selected ? "#ffff" : "#000000",
                //                 color: game.selected ? "#ffff" : "#ffff",
                fontSize: 17,
                flex: 1,
                textAlignVertical: "center",

                color: '#ffff',
                overflow: "hidden",

            }}>{game.name}</Text>

        </View>
    )
}