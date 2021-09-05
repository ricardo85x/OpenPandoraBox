import React from 'react';

import { View, Text, Image } from 'react-native';

export const Header = ({ height, title }) => {

    return (
        <View style={{
            display: 'flex',
            width: '100%',
            backgroundColor: 'orange',
            justifyContent: "flex-start",
            alignContent: "center",
            flexDirection: "row",

        }}>

            <Image
                source={require('../assets/images/logo_title.png')}
                style={{
                    width: '50%',
                    height: height
                }}
                resizeMode={'contain'}
            />

            <Text style={{ fontSize: 18, alignSelf: "center" }}> {title}</Text>

        </View>
    )
}

