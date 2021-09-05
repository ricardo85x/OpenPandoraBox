import React from 'react';
import { View, Text } from 'react-native';

export const FooterItem = ( {btnColor = "black", bgColor = "white", btnName, btnText } ) => {

    return (
        <View style={{ margin: 2, border: "2px solid black", width:45, height: 45, justifyContent: "center", backgroundColor: bgColor, borderRadius: 30 }}>
            <Text style={{ alignSelf: "center", lineHeight: 16, fontSize: 17, fontWeight: "bold" }}>{btnName}</Text>
            <Text style={{ color: btnColor, alignSelf: "center", fontSize: 10, fontWeight: "bold" }}>{btnText}</Text>
        </View>
    )
}