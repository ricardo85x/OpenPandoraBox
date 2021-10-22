import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {useSettingsContext} from "../../hooks/useSettings";


export const FooterItem = ({ buttonAction, btnName, btnText }) => {

    const { appSettings, chakraColors } = useSettingsContext()

    const btColor = (appSettings?.THEME && Object.keys(appSettings?.THEME).indexOf(`colorButton_${btnName}`)) ? appSettings.THEME[`colorButton_${btnName}`]: "white"

    const button_colors = (!! btColor && 
        Object.keys(chakraColors).includes(btColor)) ? 
            [ chakraColors[btColor][3],chakraColors[btColor][4],chakraColors[btColor][5] ] :  
            ["#ffffff",chakraColors.gray[0],chakraColors.gray[1]]

    return (
        <TouchableOpacity 
            onPress={() => buttonAction(btnName)}
        >
            <LinearGradient
                colors={button_colors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}

                style={{ margin: 5, border: "2px solid black", width: 45, height: 45, justifyContent: "center", borderRadius: 35 }}>
                <Text style={{ color: "#000000", alignSelf: "center", lineHeight: 16, fontSize: 16, fontWeight: "bold" }}>{btnName}</Text>
                <Text style={{ color: "#000000", fontSize: 10, alignSelf: "center", fontWeight: "bold" }}>{btnText}</Text>
            </LinearGradient>
        </TouchableOpacity>

    )
}
