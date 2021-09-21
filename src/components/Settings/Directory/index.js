import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { useSettingsContext } from "../../../hooks/useSettings"

import { FileBrowser } from "../../FileBrowser";

import { PandaConfig } from "../../../utils/PandaConfig"

export const DirectorySettings = ({ navigation, route }) => {

  const { APP_WIDTH, APP_HEIGHT, keyMap } = useSettingsContext()

  const fileBrowserRef = useRef();

  const [, forceUpdate] = useReducer(x => x + 1, 0);

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
          if (key && Object.keys(_dirConfig).includes(key)) {
            return { ...item, value: _dirConfig[key] }
          }
          return item
        })
      }

      setSettings(settingsRef.current)
      pageSettingsRef.current = settingsRef.current.data.slice(0, PER_PAGE()).map((item,i) => {
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

  useEffect(() => {
    // if(settings?.data && pageSettings.length){

    //   settingsRef.current = settingsRef.current.data.map(s => {
    //     const pageItem = pageSettings.find(p => p.index === s.index)
    //     if(pageItem){
    //       return { ...s, value: pageItem.value}
    //     }
    //     return s
    //   })

    //   setSettings(settingsRef.current)
    // }
    
  }, [pageSettings])



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
    let selected = pageSettingsRef.current.length ?  pageSettingsRef.current.find(g => g.selected): undefined;

    let _pageSettingsRef = pageSettingsRef.current;

    if (!selected) {
        return;
    }

    // console.log("first    ", first_item.index)
    // console.log("last     ", last_item.index)
    // console.log("selected ", selected.index)

    switch (direction) {
      case "UP":
        // console.log("TO up", selected.index, selected.name);

        if (selected.index !== 0) {

          // check if it is not the first of the list
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

        // console.log("To down")
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

    // first_item = _pageSettingsRef.length ? _pageSettingsRef[0] : undefined;
    // last_item = _pageSettingsRef.length ? _pageSettingsRef[size_page - 1] : undefined
    // selected = _pageSettingsRef.length ?  _pageSettingsRef.find(g => g.selected): undefined;
    
    // console.log("############################")
    // console.log("first    ", first_item.index)
    // console.log("last     ", last_item.index)
    // console.log("selected ", selected.index)


  }

  const handleNavigationOld = (direction = "") => {

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

    // const selectedSettings = settingsRef.current.data.find(s => s.index === settingsRef.current.active);

    const selectedSettings = pageSettingsRef.current.length ?  pageSettingsRef.current.find(g => g.selected): undefined;



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
          pageSettingsRef.current[selectedSettings.index].value = newValue
          settingsRef.current.data[selectedSettings.index].value = newValue
          setPageSettings(pageSettingsRef.current)
          forceUpdate()
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

  const ITEM_HEIGHT = 105;

  const PER_PAGE = () => {
    const bodyH = (APP_HEIGHT - 50 - 50); // modal less header
    return Math.floor(bodyH / (ITEM_HEIGHT + 1));
  }

  // console.log(pageSettingsRef)

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


          />

        </View>



        <View
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
          <View style={{
            height: 50,
            backgroundColor: "#718096",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"

          }}>
            <Text style={{
              fontSize: 30, marginLeft: 10, fontWeight: "bold", color: "white"
            }}> Directory Settings</Text>

          </View>

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
              return (
                <View key={item.key} style={{
                  height: ITEM_HEIGHT,
                  padding: 10,
                  margin: 5,
                  borderWidth: 1,
                  width: "100%",
                  backgroundColor: item.selected ? "#FEEBC8" : "#CBD5E0",
                  borderRadius: 10
                }}>
                  <Text style={{
                    fontSize: 20, fontWeight: "bold"
                  }}>{item.name}</Text>
                  <Text>{item.desc}</Text>
                  <Text style={{
                    padding: 10,
                    marginVertical: "auto",
                    backgroundColor: item.selected ? "#FFFAF0" : "#E2E8F0",
                    borderWidth: 1
                  }}>{item.value}</Text>
                </View>
              )

            })}

          </View>


          {/* Footer */}
          <View style={{
            width: "100%",
            height: 50,

            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "wrap",
            // backgroundColor: "#132640",
            backgroundColor: "#718096",
            borderTopColor: "#ffff",
            borderTopWidth: 1
          }}>
            <View style={{ margin: 5, border: "2px solid black", width: 45, height: 45, justifyContent: "center", backgroundColor: "white", borderRadius: 35 }}>
              <Text style={{ alignSelf: "center", lineHeight: 16, fontSize: 17, fontWeight: "bold" }}>A</Text>
              <Text style={{ alignSelf: "center", fontSize: 10, fontWeight: "bold" }}>EDIT</Text>
            </View>
            <View style={{ margin: 5, border: "2px solid black", width: 45, height: 45, justifyContent: "center", backgroundColor: "yellow", borderRadius: 35 }}>
              <Text style={{ alignSelf: "center", fontSize: 17, lineHeight: 16, fontWeight: "bold" }}>B</Text>
              <Text style={{ alignSelf: "center", fontSize: 10, fontWeight: "bold" }}>BACK</Text>
            </View>
            <View style={{ margin: 5, border: "2px solid black", width: 45, height: 45, justifyContent: "center", backgroundColor: "red", borderRadius: 35 }}>
              <Text style={{ color: "white", alignSelf: "center", lineHeight: 16, fontSize: 17, fontWeight: "bold" }}>C</Text>
              <Text style={{ color: "white", alignSelf: "center", fontSize: 10, fontWeight: "bold" }}>RESET</Text>
            </View>


          </View>

        </View>

      </SafeAreaView>
    </>
  )
}


