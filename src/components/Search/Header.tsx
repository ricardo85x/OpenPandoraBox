import React from 'react';
import { Text } from 'react-native';

import {useSettingsContext} from "../../hooks/useSettings";
import LinearGradient from 'react-native-linear-gradient';

interface HeaderProps {
    title: string | undefined;
    gameName: string | undefined
}

export const Header = ( { title, gameName = ""}: HeaderProps) => {

    const { APP_WIDTH, themeColor } = useSettingsContext()

    return (
        <LinearGradient 
        
        colors={[themeColor[3], themeColor[4], themeColor[5]]}
        
        style={{
            height: 50,
            width: (APP_WIDTH * 0.65),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
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
                {title ? title : "Search"}
            </Text>

            <Text style={{ 
                fontSize: 14, 
                fontWeight: "bold", 
                color: 'black',
            }}>
                {gameName}
            </Text>
        </LinearGradient>
    )
}
