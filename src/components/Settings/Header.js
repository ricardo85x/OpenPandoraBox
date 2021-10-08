import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Text, Image } from 'react-native';

export const Header = ({title}) => {

    return (
        <LinearGradient colors={['#F6AD55', '#ED8936', '#DD6B20']} 
        
            style={{
          
            display: 'flex',
            width: '100%',
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row",
            height: 50


          }}>

            <Image
                source={require('../../assets/images/logo_title.png')}
                style={{
                    width: 50 * 7.678571428571,
                    height: 50
                }}
                resizeMode={'contain'}
            />

            <Text style={{
              fontSize: 30, marginLeft: 10, color: "white"
            }}>{title}</Text>
          </LinearGradient>
    )
}