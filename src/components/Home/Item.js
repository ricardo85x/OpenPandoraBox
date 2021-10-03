import React, {useMemo} from 'react';

import { TouchableOpacity, Text, StyleSheet, Dimensions, Image } from "react-native"

import { useSettingsContext } from "../../hooks/useSettings"

export const Item = ({ item, navigation, currentIndex, keyMaps }) => {

  const { appSettings, APP_WIDTH, APP_HEIGHT } = useSettingsContext()

  const SLIDER_WIDTH = APP_WIDTH + 80;
  const ITEM_HEIGHT = APP_HEIGHT;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

  const text = item?.text ? item.text : "TEXT";
  const title = item?.title ? item.title : "TITLE";
  const type = item?.type ? item.type : "TYPE";
  const background = item?.background ? item.background : "";

  const backgroundImage = useMemo( () => {

    let currentBg = ""
    if (type === "platform") {
      currentBg = { uri: `file://${background}` }
    } else if (type === "settings") {
      if (appSettings?.THEME?.settingsBackgroundImg){
        currentBg = { uri: `file://${appSettings.THEME.settingsBackgroundImg}` }
      } 
    } else if (type === "history") {
      if (appSettings?.THEME?.historyBackgroundImg){
        currentBg = { uri: `file://${appSettings.THEME.historyBackgroundImg}` }
      }
    }

    const minPathSize = "file://".length + 3;

    if(currentBg?.uri?.length > minPathSize ){
      return currentBg
    }

    return undefined

  },[type, background])

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

        backgroundColor: backgroundImage ? "transparent" : currentIndex == item.index ?
           "#333333" :
           "#242424",

        width: ITEM_WIDTH,
        height: ITEM_HEIGHT - (ITEM_HEIGHT * 0.2),

      }}
    >

      { (background || backgroundImage) ? (

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
