import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { Utils } from "../../../utils"

import { FileBrowser } from "../../FileBrowser";

import { PandaConfig } from "../../../utils/PandaConfig"

export const DirectorySettings = ({ navigation, route }) => {

  const fileBrowserRef = useRef();

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const { APP_WIDTH, APP_HEIGHT } = Utils()

  const { params: { keyMaps } } = route;

  const pandaConfig = PandaConfig();

  const defaultSettings = {
    folderIsOpen: false,
    selectedFileFolder: "",
    active: 3,
    data: [
      {
        index: 0, key: "RETROARCH_CONFIG",
        name: "Retroarch config dir", desc: "Folder where retroarch.cfg is saved",
        type: "dir",
        value: "/data/data/com.openpanda/files/retroarch.cfg"
      },
      {
        index: 1, key: "RETROARCH_APK_ID",
        name: "Retroarch 32 or 64", desc: "whether the retroarch is 64 or 32 bits",
        type: "choice",
        options: ["com.retroarch.ra32", "com.retroarch"],
        value: "com.retroarch.ra32"
      },
      {
        index: 2, key: "CORE_DIR",
        name: "Core Directory", desc: "Directory where retroarch core is stored",
        type: "dir",
        value: "/storage/external_storage/sdcard1/retroarch/cores"
      },
      {
        index: 3, key: "BASE_ROOM_DIR",
        name: "Roms Directory", desc: "Directory where platform with roms is stored",
        type: "dir",
        value: "/storage/external_storage/sdcard1/roms"
      },

    ]

  }

  const [settings, setSettings] = useState(defaultSettings)
  const settingsRef = useRef(defaultSettings)


  useEffect(() => {
    const loadSettings = async () => {

      const _dirConfig = await pandaConfig.dirConfig();

      const settingKeys = settingsRef.current.data.map(i => i.key);

      settingsRef.current = {
        ...settingsRef.current,
        data: settingsRef.current.data.map(item => {
          const key = settingKeys.find(k => k == item.key)
          if (key && Object.keys(_dirConfig).includes(key)) {
            return { ...item, value: _dirConfig[key] }
          }
          return item
        })
      }

      setSettings(settingsRef.current)
      // hack to ListenKeyBoard work
      await new Promise(resolve => setTimeout(resolve, 1000))
      KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
    }
    loadSettings()
  }, [])

  const ListenKeyBoard = (keyEvent) => {


    if (settingsRef.current.folderIsOpen) {

      fileBrowserRef.current?.listenInput(keyEvent.keyCode, keyMaps)

    } else {


      if (keyMaps.upKeyCode?.some(key => key === keyEvent.keyCode)) {
        handleNavigation("UP")
      } else if (keyMaps.downKeyCode?.some(key => key === keyEvent.keyCode)) {
        handleNavigation("DOWN")
      } else if ([...keyMaps.P1_A, ...keyMaps.P2_A].includes(keyEvent.keyCode)) {

        handleNavigation("A")

      }


      if (keyMaps.P1_B?.includes(keyEvent.keyCode)) {

        if (navigation.canGoBack()) {
          navigation.goBack()
        } else {
          navigation.navigate('Settings', { keyMaps })
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

    switch (direction) {
      case "UP":
        // console.log("To UP");
        settingsRef.current = {
          ...settingsRef.current,
          active:
            settingsRef.current.active > 0 ?
              settingsRef.current.active - 1 :
              (settingsRef.current.data.length - 1)
        }
        setSettings(settingsRef.current)

        break;
      case "DOWN":

        settingsRef.current = {
          ...settingsRef.current,
          active:
            (settingsRef.current.active >= (settingsRef.current.data.length - 1)) ?
              0 :
              settingsRef.current.active + 1
        }
        setSettings(settingsRef.current)

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


  const handleSelection = () => {

    const selectedSettings = settingsRef.current.data.find(s => s.index === settingsRef.current.active);

    if (selectedSettings) {
      if (selectedSettings.type == "choice") {
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
          settingsRef.current = {
            ...settingsRef.current, data: settingsRef.current.data.map(item => {
              if (item.index === settingsRef.current.active) {
                return {
                  ...item,
                  value: newValue
                }
              }
              return item
            })
          }
          setSettings(settingsRef.current)
        }
      } else if (selectedSettings.type == "dir") {

        if (settingsRef.current.folderIsOpen == false) {

          settingsRef.current.selectedFileFolder = selectedSettings.value
          settingsRef.current.folderIsOpen = true
          setSettings(settingsRef.current)
          setTimeout(() => {
            forceUpdate()
          }, 100);

        }

      }
    }
  }

  const DebugButton = ({ textButton, debugFunction }) => {
    return (
      <TouchableOpacity
        onPress={() => debugFunction()}
        style={{
          marginHorizontal: 10,
          borderRadius: 10,
          fontSize: 30,
          color: "white"
        }}
      >
        <Text>{textButton}</Text>
      </TouchableOpacity>
    )
  }



  const handleSetFolderReturn = async (data) => {
    const selectedSettings = settingsRef.current.data.find(s => s.index === settingsRef.current.active);

    if (data?.type === selectedSettings.type) {

      let value = data?.value;

      if (value) {
        if (value === "..") {
          value = data.dir;
        } else {
          value = `${data.dir}/${value}`;
        }

        const updated = await pandaConfig.updateConfig({
          key: selectedSettings.key,
          value
        });

        if (updated) {
          settingsRef.current = {
            ...
            settingsRef.current,
            data: settingsRef.current.data.map(item => {
              if (item.key === selectedSettings.key) {
                // console.log("AEEEE ou nao")
                return { ...item, value }
              }
              return item
            })
          }
        }

      }

    } else {
      // console.log("Invalid selection")
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
            setSelectedFileFolder={setSelectedFileFolder}
            handleSetFolderReturn={handleSetFolderReturn}
            keyMaps={keyMaps}

          />

        </View>



        <View
          style={{
            elevation: -1,
            zIndex: -1,
            display: 'flex',
            flexDirection: "column",
            width: APP_WIDTH,
            height: APP_HEIGHT,


          }}
        >
          <View style={{
            height: 70,
            backgroundColor: "#718096",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"

          }}>
            <Text style={{
              fontSize: 40, fontWeight: "bold", color: "white"
            }}> Directory Settings</Text>

            <DebugButton
              textButton="⬆️"
              debugFunction={() => handleNavigation("UP")}
            />
            <DebugButton
              textButton="⬇️"
              debugFunction={() => handleNavigation("DOWN")}
            />
            <DebugButton
              textButton="(A)"
              debugFunction={() => handleNavigation("A")}
            />
            <DebugButton
              textButton="(B)"
              debugFunction={() => handleNavigation("B")}
            />

            <Text style={{
              fontSize: 15, fontWeight: "bold", color: "white"
            }}>Selected: {settings.selectedFileFolder}</Text>

          </View>

          <View style={{
            height: APP_HEIGHT - 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 10


          }}
          >

            {settings.data.map(item => {
              return (
                <View key={item.key} style={{
                  padding: 10,
                  margin: 5,
                  borderWidth: 1,
                  width: "100%",
                  backgroundColor: settingsRef.current.active === item.index ? "#A0AEC0" : "#718096",
                  borderRadius: 10
                }}>
                  <Text style={{
                    fontSize: 20, fontWeight: "bold"
                  }}>{item.name}</Text>
                  <Text>{item.desc}</Text>
                  <Text style={{
                    padding: 10,
                    marginVertical: "auto",
                    backgroundColor: "#E2E8F0",
                    borderWidth: 1
                  }}>{item.value}</Text>
                </View>
              )

            })}

          </View>


          {/* Footer */}
          <View style={{
            width: "100%",
            height: 80,

            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "wrap",
            // backgroundColor: "#132640",
            backgroundColor: "#718096",
            borderTopColor: "#ffff",
            borderTopWidth: 1
          }}>
            <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: "white", borderRadius: 35 }}>
              <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>A</Text>
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>EDIT</Text>
            </View>
            <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: "yellow", borderRadius: 35 }}>
              <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>B</Text>
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>BACK</Text>
            </View>
            <View style={{ margin: 5, border: "2px solid black", width: 70, height: 70, justifyContent: "center", backgroundColor: "red", borderRadius: 35 }}>
              <Text style={{ color: "white", alignSelf: "center", fontSize: 20, fontWeight: "bold" }}>C</Text>
              <Text style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}>RESET</Text>
            </View>


          </View>

        </View>

      </SafeAreaView>
    </>
  )
}


