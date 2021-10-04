import React from 'react';
import { View } from 'react-native';

import { FooterItem } from "./FooterItem"

import { useSettingsContext } from "../../hooks/useSettings";

export const Footer = () => {

    const { APP_WIDTH  } = useSettingsContext()


    return (
        <View style={{
            width: (APP_WIDTH * 0.65) - 2,
            marginRight: 2,
            borderBottomWidth: 2,
            borderBottomColor: "white",

            height: 50,
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: "orange",
        }}>

            <FooterItem bgColor="white"  btnName="A" btnText="SELECT" />
            <FooterItem bgColor="yellow" btnName="B" btnText="BACK" />
            <FooterItem bgColor="violet" btnName="D" btnText="RELOAD" />
            <FooterItem bgColor="red"    btnName="C" btnText="PREV" btnColor="white"/>
            <FooterItem bgColor="green"  btnName="F" btnText="NEXT" btnColor="white"/>

        </View>
    )
}