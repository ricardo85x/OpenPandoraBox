import React from 'react';
import { View, Text } from 'react-native';
import { Utils } from "../../utils";

import { GameItem } from "./GameItem";

import {useKeyboardContext} from "../../hooks/keyboardHook"

export const GameList = ( { keyboardActiveRef, games = [], EXTRA_SPACE } ) => {

    const { searchText } = useKeyboardContext()

    const { APP_WIDTH, APP_HEIGHT } = Utils()

    return (
        <View style={{ 
            width: APP_WIDTH * 0.35, 
            
        }}>
            { 
                games.length ? 
                games.map((game) => (
                    <GameItem keyboardActiveRef={keyboardActiveRef} key={game.path} EXTRA_SPACE={EXTRA_SPACE} APP_WIDTH={APP_WIDTH} APP_HEIGHT={ APP_HEIGHT} game={game} />
                ))

                : <Text style={{ color: 'white'}}>{searchText.trim() ? "No game found" : "Search a game" }</Text>
            }
       
        </View>
    )
}
