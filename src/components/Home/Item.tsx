import React, {useMemo} from 'react';
import { TouchableOpacity, Text, View, Image } from "react-native"
import { StackNavigationProp } from '@react-navigation/stack';

import { useSettingsContext } from "../../hooks/useSettings"
import { IMenuItem } from '../../utils/types';

interface ItemProps {
  item: IMenuItem,
  navigation: StackNavigationProp<any,any>,
  currentIndex: number,
  keyMaps: any
}

export const Item = ({ item, navigation, keyMaps }: ItemProps) => {

  const { appSettings, APP_WIDTH, APP_HEIGHT, chakraColors,  themeColor } = useSettingsContext()
  const SLIDER_WIDTH = APP_WIDTH + 80;
  const ITEM_HEIGHT = APP_HEIGHT;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

  const title = item?.title ? item.title : "TITLE";
  const type = item?.type ? item.type : "TYPE";
  const background = item?.background ? item.background : "";

  const backgroundImage = useMemo( () => {

    const FILE_URI = "file://"

    const defaultValue = { uri: "" }
    let currentBg = defaultValue

    if (type === "platform" && title !== "All") {
      currentBg = { uri: `${FILE_URI}${background}` }
    } else if (type === "settings") {
      if (appSettings?.THEME?.settingsBackgroundImg){
        currentBg = { uri: `${FILE_URI}${appSettings.THEME.settingsBackgroundImg}` }
      } 
    } else if (type === "history") {
      if (appSettings?.THEME?.historyBackgroundImg){
        currentBg = { uri: `${FILE_URI}${appSettings.THEME.historyBackgroundImg}` }
      }
    } else if (type === "favorite") {
      if (appSettings?.THEME?.favoriteBackgroundImg){
        currentBg = { uri: `${FILE_URI}${appSettings.THEME.favoriteBackgroundImg}` }
      }
    } else if (type === "search") {
      if (appSettings?.THEME?.searchBackgroundImg){
        currentBg = { uri: `${FILE_URI}${appSettings.THEME.searchBackgroundImg}` }
      }
    }  else if (type === "platform" && title === "All") {
      if (appSettings?.THEME?.allBackgroundImg){
        currentBg = { uri: `${FILE_URI}${appSettings.THEME.allBackgroundImg}` }
      }
    }


    const minPathSize = FILE_URI.length + 3;

    if(currentBg.uri.length > minPathSize ){
      return currentBg
    } else {
      return defaultValue
    }

  },[type, background])

  return (

    <TouchableOpacity
      onPress={() => {

        if (type === "system") {
          navigation.navigate('System', { item: item })
        } else if (type === "platform") {
          navigation.navigate('Platform', { item: item, keyMaps })
        } else if (type === "history") {
          navigation.navigate('History', { item: item, keyMaps })
        } else if (type === "favorite") {
          navigation.navigate('Favorite', { item: item, keyMaps })
        }

      }}

      style={{

        backgroundColor: backgroundImage.uri.length  ? 
          "transparent" : 
          chakraColors.gray[7],
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT - (ITEM_HEIGHT * 0.2),

        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",

      }}
    >

      { backgroundImage.uri.length > 0 ? (

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
        <View style={{ 
          width: ITEM_WIDTH, 
          backgroundColor: themeColor[5],
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          
        }}>
          <View style={{marginVertical: 15}}>
          <Text style={{
               color: "#ffff",
               fontSize: 28,
               fontWeight: "bold",
            }}>{title}</Text>
          </View>
                  
        </View>
      )}

    </TouchableOpacity>
  )
}

