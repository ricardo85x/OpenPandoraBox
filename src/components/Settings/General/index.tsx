import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { useSettingsContext } from "../../../hooks/useSettings"

import { FileBrowser } from "../../FileBrowser";
import { Header } from "../Header"
import { Footer } from "../../Footer"

import { PandaConfig } from "../../../utils/PandaConfig"

import LinearGradient from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { IKeyEvent } from '../../../utils/types';

interface GeneralSettingsProps {
  navigation: StackNavigationProp<any, any>
}


interface defaultSettingsDataProps {
  index: number
  key: string
  name: string
  desc: string
  type: string
  value: string
  fileName?: string
  options?: string[]
  selected?: boolean
}

interface defaultSettingsProps {
  folderIsOpen: boolean,
  selectedFileFolder: string,
  type: string,
  active: number,
  data: defaultSettingsDataProps[]
}

export const GeneralSettings = ({ navigation } : GeneralSettingsProps) => {

  const { APP_WIDTH, APP_HEIGHT, keyMap, themeColor, chakraColors } = useSettingsContext()

  const fileBrowserRef = useRef<any>();

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const pandaConfig = PandaConfig();

  const defaultSettings : defaultSettingsProps = {
    folderIsOpen: false,
    selectedFileFolder: "",
    type: "",
    active: 0,
    data: [
      {
        index: 0, key: "RETROARCH_CONFIG",
        name: "Retroarch config dir", desc: "Folder where retroarch.cfg is saved",
        type: "dir",
        value: "/data/data/com.openpanda/files",
        fileName: "retroarch.cfg",
      },
      {
        index: 1, key: "RETROARCH_APK_ID",
        name: "Retroarch 32 or 64", desc: "whether the retroarch is 64 or 32 bits",
        type: "choice",
        options: ["com.retroarch.ra32", "com.retroarch"],
        value: "com.retroarch.ra32"
      },
      // {
      //   index: 2, key: "CORE_DIR",
      //   name: "Core Directory", desc: "Directory where retroarch cores is stored",
      //   type: "dir",
      //   value: "/data/data/com.retroarch.ra32/cores"
      // },
      {
        index: 2, key: "BASE_ROOM_DIR",
        name: "Roms Directory", desc: "Directory where platform with roms is stored",
        type: "dir",
        value: "/storage/external_storage/sdcard1/roms"
      },

      {
        index: 3, key: "SAVE_CONFIG",
        name: "Save Configuration", desc: "The configuration will be saved to file",
        type: "save",
        value: "save"
      }

    ]

  }

  const [, setSettings] = useState<defaultSettingsProps>(defaultSettings)
  const pageSettingsRef = useRef<defaultSettingsDataProps[]>([])
  const [pageSettings, setPageSettings] = useState<defaultSettingsDataProps[]>([])
  const settingsRef = useRef<defaultSettingsProps>(defaultSettings)

  useEffect(() => {

    const loadSettings = async () => {

      const _dirConfig = await pandaConfig.dirConfig();

      const settingKeys = settingsRef.current.data.map(i => i.key);

      settingsRef.current = {
        ...settingsRef.current,
        data: settingsRef.current.data.map(item => {
          const key = settingKeys.find(k => k == item.key)
          if (key && Object.keys(_dirConfig).includes(key)) {
            const newValue = { ...item, value: _dirConfig[key as keyof typeof _dirConfig] as string }
            return newValue
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
      KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) => ListenKeyBoard(keyEvent));
    }
    loadSettings()
  }, [])


  useEffect(() => {
    setPageSettings(pageSettingsRef.current)
  }, [pageSettingsRef])

  const ListenKeyBoard = (keyEvent : IKeyEvent) => {

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
      KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) => ListenKeyBoard(keyEvent));
      return () => {
        KeyEvent.removeKeyDownListener();
      };
    }, [])
  );

  const setFolderIsOpen = (value: boolean) => {
    settingsRef.current.folderIsOpen = value
    setSettings(settingsRef.current)
    setTimeout(() => {
      forceUpdate()
    }, 100);
  }

  const setSelectedFileFolder = (value: string) => {

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

        if (first_item && selected.index !== 0) {

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
                selected: page.index === first_item!.index - 1
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

        if (selected.index !== last_item!.index) {
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
          if (first_item && last_item && last_item.index < (settingsRef.current.data.length - 1)) {

            _pageSettingsRef = settingsRef.current.data.slice(first_item.index + 1, first_item.index + 1 + PER_PAGE()).map((game) => {
              return {
                ...game,
                selected: game.index === selected!.index + 1
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


    console.log("Selected",selectedSettings)


    if (selectedSettings) {
      if (selectedSettings.type == "choice" && selectedSettings?.options ) {
        const choiceIndex = selectedSettings.options.findIndex(o => o === selectedSettings.value);

        let newValue;
        if (choiceIndex !== -1) {

          if (choiceIndex >= (selectedSettings.options.length - 1)) {
            newValue = selectedSettings.options[0]
          } else {
            newValue = selectedSettings.options[choiceIndex + 1]
          }
        }
        if (newValue && selectedSettingsIndex !== undefined) {
          pageSettingsRef.current[selectedSettingsIndex].value = newValue
          settingsRef.current.data[selectedSettings.index].value = newValue
          setPageSettings(pageSettingsRef.current)
          forceUpdate()
        }
      } else if (selectedSettings.type == "dir") {

        if (settingsRef.current.folderIsOpen == false) {

          if (selectedSettings?.fileName && selectedSettings.value) {

            const new_path = selectedSettings.value.substr(0, selectedSettings.value.length - selectedSettings.fileName.length - 1)
            settingsRef.current.selectedFileFolder = new_path

          } else {
            settingsRef.current.selectedFileFolder = selectedSettings.value

          }

          settingsRef.current.type = "dir"
          settingsRef.current.folderIsOpen = true

          setSettings(settingsRef.current)
          setTimeout(() => {
            forceUpdate()
          }, 100);

        }

      } else if (selectedSettings.type == "save") {

        const updatedSettings = settingsRef.current.data
          .filter(s => s.type !== "save")
          .reduce((a, v) => {
            if(v.key === "RETROARCH_APK_ID"){
              a = { ...a, [v.key]: v.value, CORE_DIR: `/data/data/${v.value}/cores` }

            } else {
              a = { ...a, [v.key]: v.value }
            }
            return a
          }, {}
        )

        console.log(updatedSettings)
        const updated = await pandaConfig.updateConfig(updatedSettings);

        if (updated) {
          console.log("Settings SAVED!")
          navigation.navigate('Settings')

        } else {
          console.log("Error on Saving the settings")
        }
      }
    }
  }

  const handleSetFolderReturn = async (data: string) => {

    const selectedSettingsIndex = pageSettingsRef.current.length ? pageSettingsRef.current.findIndex(g => g.selected) : undefined;
    const selectedSettings = selectedSettingsIndex !== -1 && selectedSettingsIndex !== undefined ? pageSettingsRef.current[selectedSettingsIndex] : undefined;

    if (selectedSettingsIndex !== undefined && selectedSettings){
      let updated_path = data

      if (selectedSettings?.fileName) {
        console.log("FileName", selectedSettings?.fileName)
        console.log("data", data)
        updated_path = `${data}/${selectedSettings.fileName}`;
      }
  
      pageSettingsRef.current[selectedSettingsIndex].value = updated_path
      settingsRef.current.data[selectedSettings.index].value = updated_path
      setPageSettings(pageSettingsRef.current)
      forceUpdate()
    }
   
  }

  const ITEM_HEIGHT = 105;

  const PER_PAGE = () => {
    const bodyH = (APP_HEIGHT - 50 - 50); // modal less header
    return Math.floor(bodyH / (ITEM_HEIGHT + 1));
  }

  const buttonAction = (buttonName: string) => {


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
          <Header title="General Settings" />

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
                  <Text>{item.desc}</Text>
                  <Text style={{
                    padding: 10,
                    marginVertical: "auto",
                    backgroundColor: item.selected ? chakraColors.gray[0] : chakraColors.gray[2],
                    borderWidth: 1
                  }}>{item.value}</Text>
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


