import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


import { useSettingsContext } from "../../hooks/useSettings";

interface HeaderProps {
    title: string;
    gameName: string | undefined;
    genre?: string;
    defaultTitle: string
}

export const Header = ( { title, defaultTitle, gameName = "", genre = "no filter"}: HeaderProps) => {

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
            paddingRight: 3,
       
            

        }}>
            <View style={{
                display: "flex",
                flexDirection:"row",
                justifyContent:"space-between",
                alignItems: "center"
            }}>
                <Text style={{ 
                    // flex: 1,
                    fontSize: 19, 
                    fontWeight: "bold", 
                    color: '#F7FAFC' 
                }}>
                    {title ? title : defaultTitle }
                </Text>

                

            </View>
           

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