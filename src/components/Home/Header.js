import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image } from 'react-native';

export const Header = ({ height, title }) => {

    return (
        <LinearGradient colors={['#F6AD55', '#ED8936', '#DD6B20']}  
        
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

