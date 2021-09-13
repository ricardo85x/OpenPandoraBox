import React from 'react';
import { View } from 'react-native';

import { FooterItem } from "./FooterItem"

export const Footer = () => {

    return (
        <View style={{
            width: "100%",
            height: 50,
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: "orange",
            borderTopColor: "#ffff",
            borderTopWidth: 1
        }}>

            <FooterItem bgColor="white"  btnName="A" btnText="SELECT" />
            <FooterItem bgColor="yellow" btnName="B" btnText="BACK" />
            <FooterItem bgColor="violet" btnName="D" btnText="REMOVE" />
            <FooterItem bgColor="red"    btnName="C" btnText="PREV" btnColor="white"/>
            <FooterItem bgColor="green"  btnName="F" btnText="NEXT" btnColor="white"/>

        </View>
    )
}