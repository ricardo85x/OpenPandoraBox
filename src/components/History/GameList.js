import React from 'react';
import { View, Text } from 'react-native';
import { Utils } from "../../utils";

import { GameItem } from "./GameItem";

export const GameList = ( { games = [], EXTRA_SPACE } ) => {

    const { APP_WIDTH, APP_HEIGHT } = Utils()

    return (
        <View style={{ 
            width: APP_WIDTH * 0.35, 
            backgroundColor: "#CBD5E0" 
        }}>
            { 
                games.length ? 

                games.map((game) => (
                    <GameItem key={game.path} EXTRA_SPACE={EXTRA_SPACE} APP_WIDTH={APP_WIDTH} APP_HEIGHT={ APP_HEIGHT} game={game} />
                ))

                : <Text>Loading...</Text>
            
            }
       
        </View>
    )
}
