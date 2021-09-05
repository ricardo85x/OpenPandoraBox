import React from 'react';
import { View } from 'react-native';

import { FooterItem } from "./FooterItem"

export const Footer = () => {

    return (
        <View style={{
            width: "100%",
            height: 80,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: "#718096",
            borderTopColor: "#ffff",
            borderTopWidth: 1
        }}>

            <FooterItem bgColor="white"  btnName="A" btnText="SELECT" />
            <FooterItem bgColor="yellow" btnName="B" btnText="BACK" />

        </View>
    )
}