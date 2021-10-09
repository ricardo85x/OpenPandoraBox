import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {useSettingsContext} from "../../hooks/useSettings";


export const FooterItem = ({ buttonAction, color = "white", btnName, btnText }) => {

    const { appSettings } = useSettingsContext()

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

    const button_color_settings = appSettings?.THEME[`colorButton_${btnName}`]

    const button_colors = (!! button_color_settings && 
        Object.keys(colorMap).includes(button_color_settings)) ? 
            colorMap[button_color_settings] :  colorMap.white

    return (
        <TouchableOpacity 
            onPress={() => buttonAction(btnName)}
        >
            <LinearGradient
                colors={button_colors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}

                style={{ margin: 5, border: "2px solid black", width: 45, height: 45, justifyContent: "center", backgroundColor: color, borderRadius: 35 }}>
                <Text style={{ color: textColorMap.white, alignSelf: "center", lineHeight: 16, fontSize: 16, fontWeight: "bold" }}>{btnName}</Text>
                <Text style={{ color: textColorMap.white, fontSize: 10, alignSelf: "center", fontWeight: "bold" }}>{btnText}</Text>
            </LinearGradient>
        </TouchableOpacity>

    )
}
