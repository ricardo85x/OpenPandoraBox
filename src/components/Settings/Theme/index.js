import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text, Image } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { useSettingsContext } from "../../../hooks/useSettings"

import { FileBrowser } from "../../FileBrowser";
import { Header } from "../Header"
import { Footer } from "../../Footer"

import { PandaConfig } from "../../../utils/PandaConfig"

import LinearGradient from 'react-native-linear-gradient';


export const ThemeSettings = ({ navigation, route }) => {

  const { APP_WIDTH, APP_HEIGHT, keyMap, updateSettings, themeColor, chakraColors } = useSettingsContext()

  const fileBrowserRef = useRef();
  const lastDirectory = useRef("/storage")


  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const pandaConfig = PandaConfig();

  const defaultSettings = {
    folderIsOpen: false,
    selectedFileFolder: "",
    type: "file",
    active: 0,
    data: [
      {
        index: 0, key: "settingsBackgroundImg",
        name: "Settings Background", desc: "This image will show on home screen",
        type: "file",
        value: "",
      },
      {
        index: 1, key: "historyBackgroundImg",
        name: "History Background", desc: "This image will show on home screen",
        type: "file",
        value: "",
      },
      {
        index: 2, key: "colorButton_A",
        name: "Button A Color", desc: "select the button color",
        type: "color",
        options: Object.keys(chakraColors),
        value: "white"
      },
      {
        index: 3, key: "colorButton_B",
        name: "Button B Color", desc: "select the button color",
        type: "color",
        options: Object.keys(chakraColors),
        value: "white"
      },
      {
        index: 4, key: "colorButton_C",
        name: "Button C Color", desc: "select the button color",
        type: "color",
        options: Object.keys(chakraColors),
        value: "white"
      },
      {
        index: 5, key: "colorButton_D",
        name: "Button D Color", desc: "select the button color",
        type: "color",
        options: Object.keys(chakraColors),
        value: "white"
      },
      {
        index: 6, key: "colorButton_E",
        name: "Button E Color", desc: "select the button color",
        type: "color",
        options: Object.keys(chakraColors),
        value: "white"
      },
      {
        index: 7, key: "colorButton_F",
        name: "Button F Color", desc: "select the button color",
        type: "color",
        options: Object.keys(chakraColors),
        value: "white"
      },
      {
        index: 8, key: "themeColor",
        name: "Theme Color", desc: "select the button color",
        type: "color",
        options: Object.keys(chakraColors),
        value: "orange"
      },
      {
        index: 9, key: "SAVE_CONFIG",
        name: "Save Configuration", desc: "The configuration will be saved to file",
        type: "save",
        value: "save"
      }

    ]

  }

  const [settings, setSettings] = useState(defaultSettings)
  const pageSettingsRef = useRef([])
  const [pageSettings, setPageSettings] = useState([])
  const settingsRef = useRef(defaultSettings)

  useEffect(() => {

    const loadSettings = async () => {

      const _dirConfig = await pandaConfig.dirConfig();

      const settingKeys = settingsRef.current.data.map(i => i.key);

      settingsRef.current = {
        ...settingsRef.current,
        data: settingsRef.current.data.map(item => {
          const key = settingKeys.find(k => k == item.key)
          if (key && _dirConfig?.THEME && Object.keys(_dirConfig.THEME).includes(key)) {
            return { ...item, value: _dirConfig.THEME[key] }
          }
          return item
        })
      }

      setSettings(settingsRef.current)
      pageSettingsRef.current = settingsRef.current.data.slice(0, PER_PAGE()).map((item, i) => {
        return {
          ...item,
          selected: i === 0
        }
      })
      setPageSettings(pageSettingsRef.current)
      // hack to ListenKeyBoard work
      await new Promise(resolve => setTimeout(resolve, 1000))
      KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
    }
    loadSettings()
  }, [])


  useEffect(() => {
    setPageSettings(pageSettingsRef.current)
  }, [pageSettingsRef])

  const ListenKeyBoard = (keyEvent) => {

    if (settingsRef.current.folderIsOpen) {

      fileBrowserRef.current?.listenInput(keyEvent.keyCode)

    } else {

      if (keyMap.upKeyCode?.some(key => key === keyEvent.keyCode)) {
        handleNavigation("UP")
      } else if (keyMap.downKeyCode?.some(key => key === keyEvent.keyCode)) {
        handleNavigation("DOWN")
      } else if ([...keyMap.P1_A, ...keyMap.P2_A].includes(keyEvent.keyCode)) {
        handleNavigation("A")
      }

      if (keyMap.P1_B?.includes(keyEvent.keyCode)) {

        if (navigation.canGoBack()) {
          navigation.goBack()
        } else {
          navigation.navigate('Settings')
        }
      }

    }

  }

  useFocusEffect(
    React.useCallback(() => {
      KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
      return () => {
        KeyEvent.removeKeyDownListener();
      };
    }, [])
  );

  const setFolderIsOpen = (value) => {
    settingsRef.current.folderIsOpen = value
    setSettings(settingsRef.current)
    setTimeout(() => {
      forceUpdate()
    }, 100);
  }

  const setSelectedFileFolder = (value) => {

    settingsRef.current.selectedFileFolder = value
    setSettings(settingsRef.current)

    setTimeout(() => {
      forceUpdate()
    }, 100);

  }

  const handleNavigation = (direction = "") => {

    const size_page = pageSettingsRef.current.length;
    let first_item = pageSettingsRef.current.length ? pageSettingsRef.current[0] : undefined;
    let last_item = pageSettingsRef.current.length ? pageSettingsRef.current[size_page - 1] : undefined
    let selected = pageSettingsRef.current.length ? pageSettingsRef.current.find(g => g.selected) : undefined;

    let _pageSettingsRef = pageSettingsRef.current;

    if (!selected) {
      return;
    }

    switch (direction) {
      case "UP":
        if (selected.index !== 0) {
          if (selected.index !== first_item.index) {
            const currentIndex = pageSettingsRef.current.findIndex(g => g.selected)
            _pageSettingsRef = pageSettingsRef.current?.map(p => {
              return {
                ...p,
                selected: pageSettingsRef.current[currentIndex - 1].index === p.index
              }
            })
            pageSettingsRef.current = _pageSettingsRef
            setPageSettings(pageSettingsRef.current)
          } else {
            _pageSettingsRef = settingsRef.current.data.slice(first_item.index - 1, first_item.index - 1 + PER_PAGE()).map((page) => {
              return {
                ...page,
                selected: page.index === first_item.index - 1
              }
            })
            pageSettingsRef.current = _pageSettingsRef
            setPageSettings(pageSettingsRef.current)
          }
        } else {
          // console.log("No more items UP")
        }

        break;
      case "DOWN":

        if (selected.index !== last_item.index) {
          const currentIndex = pageSettingsRef.current.findIndex(g => g.selected)
          _pageSettingsRef = pageSettingsRef.current.map(game => {
            return {
              ...game,
              selected: pageSettingsRef.current[currentIndex + 1].index === game.index
            }
          })

          pageSettingsRef.current = _pageSettingsRef
          setPageSettings(pageSettingsRef.current)

        } else {

          // check if has more items
          if (last_item.index < (settingsRef.current.data.length - 1)) {

            _pageSettingsRef = settingsRef.current.data.slice(first_item.index + 1, first_item.index + 1 + PER_PAGE()).map((game) => {
              return {
                ...game,
                selected: game.index === selected.index + 1
              }
            })

            pageSettingsRef.current = _pageSettingsRef
            setPageSettings(pageSettingsRef.current)

          } else {
            // console.log("No more itens to scroll")
          }
        }

        break;
      case "A":
        handleSelection()
        break;
      case "B":
        settingsRef.current.folderIsOpen = !settingsRef.current.folderIsOpen
        setSettings(settingsRef.current)
        break;
      default:
        break
    }

  }


  const handleSelection = async () => {

    const selectedSettingsIndex = pageSettingsRef.current.length ? pageSettingsRef.current.findIndex(g => g.selected) : undefined;
    const selectedSettings = selectedSettingsIndex !== -1 && selectedSettingsIndex !== undefined ? pageSettingsRef.current[selectedSettingsIndex] : undefined;

    if (selectedSettings) {
      if (selectedSettings.type == "color") {
        const choiceIndex = selectedSettings.options.findIndex(o => o === selectedSettings.value);

        let newValue;
        if (choiceIndex !== -1) {
          if (choiceIndex >= (selectedSettings.options.length - 1)) {
            newValue = selectedSettings.options[0]
          } else {
            newValue = selectedSettings.options[choiceIndex + 1]
          }
        }
        if (newValue) {
          pageSettingsRef.current[selectedSettingsIndex].value = newValue
          settingsRef.current.data[selectedSettings.index].value = newValue
          setPageSettings(pageSettingsRef.current)
          forceUpdate()
        }
      } else if (selectedSettings.type == "file") {

        if (selectedSettings.value === "") {

          if (settingsRef.current.folderIsOpen == false) {
            settingsRef.current.selectedFileFolder = lastDirectory.current
            settingsRef.current.folderIsOpen = true
            setSettings(settingsRef.current)
            forceUpdate()
          }

        } else {

          pageSettingsRef.current = pageSettingsRef.current.map(p => {
            if (p.key === selectedSettings.key) {
              return {
                ...p,
                value: "",
              }
            }
            return p
          })

          // settingsRef.current.data[selectedSettings.key].value = ""

          settingsRef.current.data = settingsRef.current.data.map(item => {
            return {
              ...item,
              value: item.key === selectedSettings.key ? "" : item.value
            }
          })

          setPageSettings(pageSettingsRef.current)
          forceUpdate()

        }

      } else if (selectedSettings.type == "save") {

        const updatedSettings = {
          THEME: settingsRef.current.data
            .filter(s => s.type !== "save")
            .reduce((a, v) => {
              a = { ...a, [v.key]: v.value }
              return a
            }, {}
            )
        }


        const updated = await pandaConfig.updateConfig(updatedSettings);

        if (updated) {
          console.log("Settings SAVED!")

          updateSettings()
          navigation.navigate('Settings')

        } else {
          console.log("Error on Saving the settings")
        }
      }
    }
  }

  const handleSetFolderReturn = async (data) => {

    const selectedSettingsIndex = pageSettingsRef.current.length ? pageSettingsRef.current.findIndex(g => g.selected) : undefined;
    const selectedSettings = selectedSettingsIndex !== -1 && selectedSettingsIndex !== undefined ? pageSettingsRef.current[selectedSettingsIndex] : undefined;

    if (data && data.match(/.+[.](jpe?g|png)$/i)) {
      pageSettingsRef.current = pageSettingsRef.current.map(p => {
        if (p.key === selectedSettings.key) {
          return {
            ...p,
            value: data,
          }
        }
        return p

      })



      settingsRef.current.data = settingsRef.current.data.map(item => {
        return {
          ...item,
          value: item.key === selectedSettings.key ? data : item.value
        }
      })



      const matchDir = String(data).match(/(.*)\/([^\/]+)$/)

      if(matchDir && matchDir.length > 1){
        lastDirectory.current = matchDir[1]
      }


      // settingsRef.current.data[selectedSettings.key].value = data
      setPageSettings(pageSettingsRef.current)
      forceUpdate()
    }
  }

  const ITEM_HEIGHT = 105;

  const PER_PAGE = () => {
    const bodyH = (APP_HEIGHT - 50 - 50); // modal less header
    return Math.floor(bodyH / (ITEM_HEIGHT + 1));
  }

  const buttonAction = (buttonName) => {


    if (settingsRef.current.folderIsOpen == false) {
      switch (buttonName) {
        case "A":
          handleNavigation("A");
          break;
        case "B":
          if (navigation.canGoBack()) {
            navigation.goBack()
          } else {
            navigation.navigate('Settings');
          }
          break;
        default:
          break;
      }
    }


  }

  return (
    <>
      <SafeAreaView>
        {/*  Modal File Browser  */}
        <View


          style={{
            elevation: 10,
            zIndex: 10,
            width: APP_WIDTH,
            height: APP_HEIGHT,
            position: settingsRef.current.folderIsOpen ? "absolute" : "relative",
            //  display: 'none'
            display: settingsRef.current.folderIsOpen ? "flex" : "none"
          }}>

          <FileBrowser ref={fileBrowserRef}
            setFolderIsOpen={setFolderIsOpen}
            folderIsOpen={settingsRef.current.folderIsOpen}
            selectedFileFolder={settingsRef.current.selectedFileFolder}
            type={settingsRef.current.type}
            setSelectedFileFolder={setSelectedFileFolder}
            handleSetFolderReturn={handleSetFolderReturn}


          />

        </View>

        <LinearGradient

          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          colors={["#1A202C", "#2D3748", "#4A5568"]}

          style={{
            elevation: -1,
            zIndex: -1,
            display: 'flex',
            flexDirection: "column",
            justifyContent: "space-between",
            width: APP_WIDTH,
            height: APP_HEIGHT,


          }}
        >

          {/* Header */}
          <Header title="Theme Settings" />

          {/* Body */}
          <View style={{
            height: APP_HEIGHT - 50 - 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 10
          }}
          >

            {pageSettings.map(item => {

              if (item.key === settingsRef.current.data[settingsRef.current.data.length - 1].key) {

                return (
                  <View key={item.key} style={{
                    height: 50,
                    padding: 10,
                    margin: 5,
                    borderWidth: 1,
                    width: 200,
                    backgroundColor: item.selected ? chakraColors.green[4] : chakraColors.gray[3],
                    borderRadius: 10,
                    alignItems: "center"
                  }}>

                    <Text style={{
                      fontSize: 20, fontWeight: "bold"
                    }}>{item.name}</Text>

                  </View>
                )
              }


              return (
                <View key={item.key} style={{
                  height: ITEM_HEIGHT,
                  padding: 10,
                  margin: 5,
                  borderWidth: 1,
                  width: "100%",
                  backgroundColor: item.selected ? themeColor[1] : chakraColors.gray[3],

                  borderRadius: 10
                }}>
                  <Text style={{
                    fontSize: 20, fontWeight: "bold"
                  }}>{item.name}</Text>

                  {item.type === "file" ? (
                    <View style={{

                      width: 75,
                      height: 55,
                      backgroundColor: '#000',
                      alignItems: 'center',
                      justifyContent: 'center',

                    }}>

                      {item?.value ? (
                        <Image
                          source={{ uri: `file://${item.value}` }}
                          style={{
                            alignSelf: "center",
                            width: 75,
                            height: 55
                          }}
                          resizeMode={'center'}
                        />
                      ) : (
                        <Text style={{
                          textAlign: 'center',
                          fontSize: 15,
                          color: 'white'
                        }}>Image</Text>

                      )}


                    </View>
                  ) : (
                  
                      <View style={{

                        width: 55,
                        height: 55,
                        borderRadius: 27.5,
                        backgroundColor: item.value,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1

                      }}></View>
                  )}
                </View>
              )

            })}
            {
              (settingsRef.current.data[settingsRef.current.data.length - 1]?.index
                !== pageSettingsRef.current[pageSettingsRef.current.length - 1]?.index) &&
              settingsRef.current.data.length > pageSettingsRef.current.length

              && <View key="fake" style={{
                height: ITEM_HEIGHT,
                padding: 10,
                margin: 5,
                borderWidth: 1,
                width: "100%",
                backgroundColor: "#E2E8F0",
                borderRadius: 10
              }}>
                <Text style={{
                  fontSize: 20, fontWeight: "bold"
                }}>Loading more...</Text>

              </View>

            }


          </View>


          {/* Footer */}
          <Footer
            buttonAction={buttonAction}
            items={[
              { color: "white", title: "A", text: "EDIT" },
              { color: "yellow", title: "B", text: "BACK" },
              // {color: "red", title: "C", text: "RESET"},

            ]}
          />
        </LinearGradient>

      </SafeAreaView>
    </>
  )
}


