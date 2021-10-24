import React from 'react';
import { View, Text } from 'react-native';
import { useSettingsContext } from "../../hooks/useSettings";
import { IRomPlatform } from '../../utils/types';

import { GameItem } from "./GameItem";

interface GameListProps {
    games: IRomPlatform[]
    EXTRA_SPACE: number;
}

export const GameList = ( { games = [], EXTRA_SPACE } : GameListProps ) => {

    const { APP_WIDTH } = useSettingsContext()

    return (
        <View style={{ width: APP_WIDTH * 0.35 }}>
            { 
                games.length ? 

                games.map((game) => (
                    <GameItem key={game.path} EXTRA_SPACE={EXTRA_SPACE} game={game} />
                ))

                : <Text style={{color: 'white'}}>Loading...</Text>
            
            }
       
        </View>
    )
}
