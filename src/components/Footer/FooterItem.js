import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const FooterItem = ( { color = "white", btnName, btnText } ) => {

    const colorMap = {
        white: ["#FFFFFF", "#F7FAFC", "#EDF2F7"],
        red: ["#FC8181", "#F56565", "#E53E3E"],
        yellow: ["#FAF089", "#F6E05E", "#ECC94B"],
        blue: ["#90CDF4", "#63B3ED", "#4299E1"],
        green: ["#9AE6B4", "#68D391", "#48BB78"],
        pink: ["#FBB6CE", "#F687B3", "#ED64A6"]
    }

    const textColorMap = {
        white: "black",
        red: "black",
        yellow: "black",
        blue: "black",
        green: "black",
        pink: "black"
    }

    return (
        <LinearGradient 
            colors={colorMap[color]}  
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} 

        
            style={{ margin: 5, border: "2px solid black", width: 45, height: 45, justifyContent: "center", backgroundColor: color, borderRadius: 35 }}>
            <Text style={{ color: textColorMap[color], alignSelf: "center",  lineHeight: 16, fontSize: 16, fontWeight: "bold" }}>{btnName}</Text>
            <Text style={{ color: textColorMap[color], fontSize: 10, alignSelf: "center", fontWeight: "bold" }}>{btnText}</Text>
        </LinearGradient>
    )
}
