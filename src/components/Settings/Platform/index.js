import React, { useEffect, useState, useRef, useReducer } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text, Image } from 'react-native';
import KeyEvent from 'react-native-keyevent';

import { useSettingsContext } from "../../../hooks/useSettings"

import { FileBrowser } from "../../FileBrowser";

import { PandaConfig } from "../../../utils/PandaConfig"


export const PlatformSettings = ({ navigation, route }) => {

  const { APP_WIDTH, APP_HEIGHT, keyMap } = useSettingsContext()

  const fileBrowserRef = useRef();

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const pandaConfig = PandaConfig();

  const defaultSettings = []

  const [settings, setSettings] = useState(defaultSettings)
  const [cores, setCores] = useState([])
  const pageSettingsRef = useRef([])
  const [pageSettings, setPageSettings] = useState([])
  const settingsRef = useRef({
    cores: defaultSettings,
    folderIsOpen: false,
    selectedFileFolder: "",
    core_list: [],
    type: "file"
  })

  const [xIndex,setXIndex] = useState(0)
  const xIndexRef = useRef(0)

  useEffect(() => {

    const loadSettings = async () => {

      settingsRef.current.cores = await pandaConfig.listPlatforms();
      settingsRef.current.core_list = await pandaConfig.listCores()
      settingsRef.current.cores.push({
        key: settingsRef.current.cores.length,
        dir : "save",
        name: "Save Configuration", desc: "The configuration will be saved to file",
        type: "save",
        value: "save"
      })

      setSettings(settingsRef.current.cores)

      pageSettingsRef.current = settingsRef.current.cores.slice(0, PER_PAGE()).map((item, i) => {
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
      } else if (keyMap.leftKeyCode?.some(key => key === keyEvent.keyCode)) {
        handleNavigation("LEFT")
      } else if (keyMap.rightKeyCode?.some(key => key === keyEvent.keyCode)) {
        handleNavigation("RIGHT")
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
        // xIndexRef.current = 0
        // setXIndex(xIndexRef.current)

        if (selected.key !== 0) {
          // check if it is not the first of the list
          if (selected.key !== first_item.key) {

            const currentIndex = pageSettingsRef.current.findIndex(g => g.selected)

            _pageSettingsRef = pageSettingsRef.current?.map(p => {
              return {
                ...p,
                selected: pageSettingsRef.current[currentIndex - 1].key === p.key
              }
            })

            pageSettingsRef.current = _pageSettingsRef
            setPageSettings(pageSettingsRef.current)



          } else {


            _pageSettingsRef = settingsRef.current.cores.slice(first_item.key - 1, first_item.key - 1 + PER_PAGE()).map((page) => {
              return {
                ...page,
                selected: page.key === first_item.key - 1
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
        // xIndexRef.current = 0
        // setXIndex(xIndexRef.current)

        if (selected.key !== last_item.key) {
          const currentIndex = pageSettingsRef.current.findIndex(g => g.selected)
          _pageSettingsRef = pageSettingsRef.current.map(game => {
            return {
              ...game,
              selected: pageSettingsRef.current[currentIndex + 1].key === game.key
            }
          })



          pageSettingsRef.current = _pageSettingsRef
          setPageSettings(pageSettingsRef.current)


        } else {


          // check if has more items
          if (last_item.key < (settingsRef.current.cores.length - 1)) {

            _pageSettingsRef = settingsRef.current.cores.slice(first_item.key + 1, first_item.key + 1 + PER_PAGE()).map((game) => {
              return {
                ...game,
                selected: game.key === selected.key + 1
              }
            })



            pageSettingsRef.current = _pageSettingsRef
            setPageSettings(pageSettingsRef.current)


          } else {

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
      case "RIGHT":
        if(xIndexRef.current >= 0 && xIndexRef.current < 3){
          xIndexRef.current = xIndexRef.current + 1
          setXIndex(xIndexRef.current)
        }
        break;
      case "LEFT":
        if(xIndexRef.current > 0 && xIndexRef.current <= 3){
          xIndexRef.current = xIndexRef.current - 1
          setXIndex(xIndexRef.current)
        }

        break;
      default:
        break
    }

  }

  const handleSelection = async () => {

    const selectedSettingsIndex = pageSettingsRef.current.length ? pageSettingsRef.current.findIndex(g => g.selected) : undefined;
    const selectedSettings = selectedSettingsIndex !== -1 && selectedSettingsIndex !== undefined ? pageSettingsRef.current[selectedSettingsIndex] : undefined;

    if (selectedSettings) {

      if (selectedSettings?.type == "save") {


        const newPlatformSettings = settingsRef.current.cores
          .filter(f => f.type !== "save").reduce((acc, current) => {
            acc = {
              ...acc, 
              [current.dir]: {
                title: current.name,
                backgroundImg: current.background,
                core: {
                    choices: [current.core],
                    default: 0
                },
                enabled: current.enabled,
                launcher: current.launcher,
              }
            }
            return acc
        }, {})


        const updated = await pandaConfig.updateConfig({ PLATFORMS: newPlatformSettings });


        if(updated){
          // forceUpdate()
          navigation.navigate('Settings')

        } else {
          console.log("Error on Saving the settings")
        }





      } else if (xIndexRef.current === 0) {

        const newValue = !selectedSettings.enabled
        pageSettingsRef.current = pageSettingsRef.current.map(p => {
          if (p.key === selectedSettings.key){
            return {
              ...p,
              enabled:  newValue,
            }
          }
          return p
          
        })
        
        settingsRef.current.cores[selectedSettings.key].enabled = newValue
        setPageSettings(pageSettingsRef.current)
        forceUpdate()


      } else if (xIndexRef.current== 1) {

        const currentCoreIndex = settingsRef.current.core_list.indexOf(selectedSettings.core)

        let newValue = 0

        if(currentCoreIndex !== -1) {
          if(currentCoreIndex < settingsRef.current.core_list.length - 1){
            newValue = currentCoreIndex + 1;
          }
        }

        pageSettingsRef.current = pageSettingsRef.current.map(p => {
          if (p.key === selectedSettings.key){
            return {
              ...p,
              core:  settingsRef.current.core_list[newValue],
            }
          }
          return p
          
        })
        
        settingsRef.current.cores[selectedSettings.key].core = settingsRef.current.core_list[newValue]
        setPageSettings(pageSettingsRef.current)
        forceUpdate()

      } else if (xIndexRef.current == 2) {
  

        const launchers = ["retroarch", "Drastic", "MupenFz"]

        const currentLauncher = launchers.indexOf(selectedSettings.launcher)

        let newValue = 0

        if(currentLauncher !== -1) {
          if(currentLauncher < launchers.length - 1){
            newValue = currentLauncher + 1;
          }
        }

        pageSettingsRef.current = pageSettingsRef.current.map(p => {
          if (p.key === selectedSettings.key){
            return {
              ...p,
              launcher:  launchers[newValue],
            }
          }
          return p
          
        })
        
        settingsRef.current.cores[selectedSettings.key].launcher = launchers[newValue]
        setPageSettings(pageSettingsRef.current)
        forceUpdate()

      } else if (xIndexRef.current == 3) {
        console.log("UPDATE IMAGE")

        let newValue = ""

        if(selectedSettings.background === "") {

          if (settingsRef.current.folderIsOpen == false) {
            settingsRef.current.selectedFileFolder = "/storage"
            settingsRef.current.folderIsOpen = true
            setSettings(settingsRef.current)            
            forceUpdate()  
          }
          
        } else {

          pageSettingsRef.current = pageSettingsRef.current.map(p => {
            if (p.key === selectedSettings.key){
              return {
                ...p,
                background:  newValue,
              }
            }
            return p
            
          })
          
          settingsRef.current.cores[selectedSettings.key].background = newValue
          setPageSettings(pageSettingsRef.current)
          forceUpdate()

        }
      }
    }
  }

  const handleSetFolderReturn = async (data) => {

    const selectedSettingsIndex = pageSettingsRef.current.length ? pageSettingsRef.current.findIndex(g => g.selected) : undefined;
    const selectedSettings = selectedSettingsIndex !== -1 && selectedSettingsIndex !== undefined ? pageSettingsRef.current[selectedSettingsIndex] : undefined;

    if(data && data.match(/.+[.](jpe?g|png)$/i)){
      pageSettingsRef.current = pageSettingsRef.current.map(p => {
        if (p.key === selectedSettings.key){
          return {
            ...p,
            background:  data,
          }
        }
        return p
        
      })
      
      settingsRef.current.cores[selectedSettings.key].background = data
      setPageSettings(pageSettingsRef.current)
      forceUpdate()
    }

  }

  const ITEM_HEIGHT = 105;

  const PER_PAGE = () => {
    const bodyH = (APP_HEIGHT - 50 - 50); // modal less header
    return Math.floor(bodyH / (ITEM_HEIGHT + 1));
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
            }}> Platform Settings</Text>

          </View>

          {/* Body */}
          <View style={{
            height: APP_HEIGHT - 50 - 50, // app height less header and footer
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 10
          }}
          >

            {pageSettings.map(item => {

                if (item.key === settingsRef.current.cores[settingsRef.current.cores.length - 1].key) {

                  return (
                    <View key={item.key} style={{
                      height: 50,
                      padding: 10,
                      margin: 5,
                      borderWidth: 1,
                      width: 200,
                      backgroundColor: item.selected ? "#9AE6B4" : "#CBD5E0",
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
                <View key={item.dir} style={{
                  height: ITEM_HEIGHT,
                  padding: 10,
                  margin: 5,
                  borderWidth: 1,
                  width: "100%",
                  backgroundColor: item.selected ? "#FEEBC8" : "#CBD5E0",
                  borderRadius: 10,

                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row"

                }}>

                    <View style={{
                      display: 'flex',
                      flexDirection: 'column',
                      
                    }}>

                      <View style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center'
                      }}>
                      
                        <Text style={{
                          fontSize: 20, fontWeight: "bold"
                        }}>{item.name}</Text>

                        <Text style={{ color: "#718096"}}> {item.dir}</Text>
                      </View>

                    <View style={{
                      display: 'flex', flexDirection: 'row',
                    }}>

                      <View style={{

                        backgroundColor:  (item.selected && xIndexRef.current === 0) ? 
                          item.enabled ? "#63B3ED" : "#C53030" :
                          item.enabled ? "#E2E8F0" : "#FED7D7" ,

                        
                        height: 50,
                        justifyContent: "center",
                        padding: 10,
                        marginTop: 5,
                        marginRight: 10,
                        borderRadius: 10,
                        borderWidth: 1
                        
                      }}>
                          <Text style={{ 
                            margin: "auto", 
                            color:  (item.selected && xIndexRef.current === 0) ? 
                            item.enabled ? "#171923" : "#FFF5F5" :
                            "#171923" , 
                            fontWeight: "bold"
                          }}>{item.enabled ? "Enabled" : "Disabled"}</Text>

                      </View>
                      <View style={{

                        backgroundColor: item.selected && xIndexRef.current === 1 ? "#63B3ED" : "#E2E8F0" ,
                        height: 50,
                        justifyContent: "center",
                        padding: 10,
                        marginTop: 5, marginRight: 10,
                        borderRadius: 10,
                        borderWidth: 1

                        }}>
                          <Text style={{ 
                            fontWeight: "bold"
                          }}>Core</Text>
                          <Text style={{ 
                            
                          }}>{item.core}</Text>

                        </View>

                        <View style={{


                          backgroundColor: item.selected && xIndexRef.current === 2 ? "#63B3ED" : "#E2E8F0" ,
                          height: 50,
                          justifyContent: "center",
                          padding: 10,
                          marginTop: 5,
                          borderRadius: 10,
                          borderWidth: 1


                          }}>
                            <Text style={{ 
                              fontWeight: "bold"
                            }}>Launcher</Text>
                            <Text style={{ 
                              
                            }}>{item.launcher}</Text>

                          </View>

                    </View>

                    </View>

                    <View style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: -5,

                    }}>

                      <View style={{
                        width: 95,
                        height: 75,
                        backgroundColor: '#000',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10

                      }}>

                        { item?.background ? (
                          <Image
                          source={{ uri: `file://${item.background }` }}
                          style={{
                              alignSelf: "center",
                              width: 90,
                              height: 70
                          }}
                          resizeMode={'center'}
                      />
                        ) : (
                          <Text style={{ 
                            textAlign: 'center', 
                            color: 'white'
                          }}>Background image</Text>

                        )}


                      </View>
                      <View style={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        justifyContent:"center",
                        backgroundColor: item.selected && xIndexRef.current === 3 ? "#63B3ED" : "#E2E8F0" ,
                        borderWidth: 1
                      }}>
                        { item?.background ? 
                          ( <Text>Clear</Text>) : 
                          (<Text>Add</Text>) 

                        }
                           
                      </View>


                    </View>  
                </View>
              )

            })}
            {
              (settingsRef.current.cores[settingsRef.current.cores.length - 1]?.key
                !== pageSettingsRef.current[pageSettingsRef.current.length - 1]?.key) &&
              settingsRef.current.cores.length > pageSettingsRef.current.length

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
          <View style={{
            width: "100%",
            height: 50,

            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "wrap",
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
            {/* <View style={{ margin: 5, border: "2px solid black", width: 45, height: 45, justifyContent: "center", backgroundColor: "red", borderRadius: 35 }}>
              <Text style={{ color: "white", alignSelf: "center", lineHeight: 16, fontSize: 17, fontWeight: "bold" }}>C</Text>
              <Text style={{ color: "white", alignSelf: "center", fontSize: 10, fontWeight: "bold" }}>RESET</Text>
            </View> */}

          </View>

        </View>

      </SafeAreaView>
    </>
  )
}


