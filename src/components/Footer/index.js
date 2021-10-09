import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { FooterItem } from "./FooterItem"

import { useSettingsContext } from "../../hooks/useSettings";


export const Footer = ( {  items = [], buttonAction = (arg) => {} }) => {
    return (
        <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} 

            colors={['#F6AD55', '#ED8936', '#DD6B20']}
        
            style={{
            width: "100%",
            height: 50,
            display: "flex",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            borderTopColor: "#4A5568",
            borderTopWidth: 2
        }}>

            { items.map(item => 
                <FooterItem buttonAction={buttonAction} key={item.title} color={item.color}  btnName={item.title} btnText={item.text}  />  
            )}
           

        </LinearGradient>
    )
}