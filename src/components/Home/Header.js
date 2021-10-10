import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image } from 'react-native';
import { useSettingsContext } from "../../hooks/useSettings";


export const Header = ({ height, title }) => {

    const { themeColor } = useSettingsContext()


    return (
        <LinearGradient 
        
            colors={[themeColor[3], themeColor[4], themeColor[5]]}
        
            style={{
            display: 'flex',
            width: '100%',
            // backgroundColor: 'orange',
            justifyContent: "flex-start",
            alignContent: "center",
            flexDirection: "row",
            height: height

        }}>

            <Image
                source={require('../../assets/images/logo_title.png')}
                style={{
                    width: height * 7.678571428571,
                    height: height
                }}
                resizeMode={'contain'}
            />

            <Text style={{ fontSize: 18, alignSelf: "center" }}> {title}</Text>

        </LinearGradient>
    )
}

