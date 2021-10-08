import React from 'react';
import { Text, View } from 'react-native';

import {useSettingsContext} from "../../hooks/useSettings";
import LinearGradient from 'react-native-linear-gradient';


export const Header = ( { title, gameName = ""}) => {

    const { APP_WIDTH } = useSettingsContext()


    return (
        <LinearGradient colors={['#F6AD55', '#ED8936', '#DD6B20']} 
        
        style={{
            height: 50,
            width: (APP_WIDTH * 0.65) - 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: 2,
            marginRight: 2,
            paddingLeft: 10,

        }}>
            <Text style={{ 
                flex: 1,
                fontSize: 19, 
                fontWeight: "bold", 
                color: '#F7FAFC' 
            }}>
                {title ? title : "loading... or no game found"}
            </Text>

            <Text style={{ 
                fontSize: 14, 
                fontWeight: "bold", 
                color: 'black',
                flex: 1,

            }}>
                {gameName}
            </Text>

        </LinearGradient>
    )
}