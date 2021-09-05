import React from 'react';
import { View, Text } from 'react-native';

export const FooterItem = ( {btnColor = "black", bgColor = "white", btnName, btnText } ) => {

    return (
        <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: bgColor, borderRadius: 35 }}>
            <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>{btnName}</Text>
            <Text style={{ color: btnColor, alignSelf: "center", fontWeight: "bold" }}>{btnText}</Text>
        </View>
    )
}