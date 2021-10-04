import React from 'react';
import { Text, View } from 'react-native';

import { useSettingsContext } from "../../hooks/useSettings";

export const Header = ( { title, gameName = ""}) => {

    const { APP_WIDTH  } = useSettingsContext()



    return (
        <View style={{
            height: 50,
            width: (APP_WIDTH * 0.65) - 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: 2,
            marginRight: 2,
            paddingLeft: 10,
       
            // backgroundColor: "#718096",
            backgroundColor: "orange",

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

        </View>
    )
}