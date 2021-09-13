import React from 'react';
import { Text, View } from 'react-native';

import {Utils} from "../../utils";

export const Header = ( { title, gameName = ""}) => {

    const { APP_WIDTH } = Utils()

    return (
        <View style={{
            height: 50,
            width: (APP_WIDTH * 0.65),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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

        </View>
    )
}