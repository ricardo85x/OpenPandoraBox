import React from 'react';
import { View, Text } from 'react-native';
import { LOADING_STATUS } from '.';
import { useSettingsContext } from "../../hooks/useSettings";
import { IRomPlatform } from '../../utils/types';

import { GameItem } from "./GameItem";

interface GameListProps {
    games: IRomPlatform[]
    EXTRA_SPACE: number;
    LOADING: LOADING_STATUS
}

export const GameList = ( { games = [], LOADING = LOADING_STATUS.LOADING, EXTRA_SPACE } : GameListProps ) => {

    const { APP_WIDTH } = useSettingsContext()

    return (
        <View style={{ width: APP_WIDTH * 0.35 }}>
            { 
                games.length ? 

                games.map((game) => (
                    <GameItem key={game.path} EXTRA_SPACE={EXTRA_SPACE} game={game} />
                ))

                : <Text  style={{color: 'white', fontSize: 25, marginLeft: 10 }}>{ 

                    LOADING === LOADING_STATUS.LOADING ? "Loading..." : "No games found"
                
                }</Text>
            
            }
       
        </View>
    )
}
