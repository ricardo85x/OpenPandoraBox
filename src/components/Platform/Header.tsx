import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


import { useSettingsContext } from "../../hooks/useSettings";

interface HeaderProps {
    title: string;
    gameName: string | undefined;
}

export const Header = ( { title, gameName = ""}: HeaderProps) => {

    const { APP_WIDTH, themeColor  } = useSettingsContext()

    return (
        <LinearGradient 
        
            colors={[themeColor[3], themeColor[4], themeColor[5]]}
        
            style={{
            height: 50,
            width: (APP_WIDTH * 0.65) - 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: 2,
            marginRight: 2,
            paddingLeft: 10,
       
            // backgroundColor: "#718096",
            // backgroundColor: "orange",
            

        }}>
            <Text style={{ 
                flex: 1,
                fontSize: 19, 
                fontWeight: "bold", 
                color: '#F7FAFC' 
            }}>
                {title ? title : "loading..."}
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