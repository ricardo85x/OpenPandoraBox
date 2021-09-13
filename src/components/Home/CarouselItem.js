import React from 'react';

import { TouchableOpacity, Text, StyleSheet, Dimensions, Image } from "react-native"

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_HEIGHT = Dimensions.get('window').height;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

export const CarouselItem = ({ item, navigation, currentIndex, keyMaps }) => {

  const text = item?.text ? item.text : "TEXT";
  const title = item?.title ? item.title : "TITLE";
  const type = item?.type ? item.type : "TYPE";
  const background = item?.background ? item.background : "";

  const backgroundImage = type === "settings" ? 
    require("../../assets/images/bg.jpg") :
    {
      uri: `file://${background}` 
    }

  return (

    <TouchableOpacity
      onPress={() => {

        if (type === "system") {
          navigation.navigate('System', { item: item.item })
        } else if (type === "platform") {
          navigation.navigate('Platform', { item: item.item, keyMaps })
        } else if (type === "history") {
          navigation.navigate('History', { item: item.item, keyMaps })
        }

      }}

      style={{

        backgroundColor: background || type === "settings" ? 'transparent' : currentIndex == item.index ?
          "#333333" :
          "#242424",

        width: ITEM_WIDTH,
        height: ITEM_HEIGHT - (ITEM_HEIGHT * 0.2),

      }}
    >

      { (background || type === "settings") ? (

        <Image
          source={backgroundImage}
          style={{
            alignSelf: "center",
            flex: 1,
            width: '100%',
            height: ITEM_HEIGHT - (ITEM_HEIGHT * 0.2)
          }}
          resizeMode={'contain'}

        />


      ) : (
        <>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.body}>{text}</Text>
        </>
      )}

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

  header: {
    color: "#ffff",
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 20
  },
  body: {
    color: "#ffff",
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20
  }
})