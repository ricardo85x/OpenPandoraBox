import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { listDir } from "../../utils/listDir"

import { useSettingsContext } from "../../hooks/useSettings"


export const FileBrowser = forwardRef((
    {
        setFolderIsOpen,
        folderIsOpen,
        selectedFileFolder,
        setSelectedFileFolder,
        handleSetFolderReturn
    },
    ref
) => {


    const { APP_WIDTH, APP_HEIGHT, keyMap } = useSettingsContext()


    const [dirData, setDirData] = useState([])
    const [pageItems, setPageItems] = useState([])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const handleLoadDirData = async () => {

        if (!folderIsOpen) {
            return
        }

        const data = await listDir({ directory: selectedFileFolder });

        if (data.status == "success") {

            const dirDataWithIndex = [{
                type: "dir",
                value: "..",
            }, ...data.data].map((dir, i) => {
                return {
                    ...dir,
                    index: i
                }
            })
            setDirData(dirDataWithIndex)

            setSelectedIndex(0)
        }
    }

    const handleSelectItem = (save = false) => {

        let selected_value = ""

        if (dirData.length <= selectedIndex) {
            return
        }

        const selected = pageItems.find(g => g.selected);

        const selectedItem = selected ? selected : dirData[0]

        if (save) {
            handleSetFolderReturn(selected);
            setFolderIsOpen(false)
            return
        }

        if (selectedItem.type === "dir") {
            if (selectedItem.value === "..") {
                const folders = selectedFileFolder.split("/").filter(f => !!f) // empty not allowed
                if (folders.length > 0) {
                    selected_value = selectedFileFolder.slice(0, (-1 * (folders[folders.length - 1].length + 1)))
                    if (!!selected_value) {
                        setSelectedFileFolder(selected_value)
                    }
                }
            } else {
                selected_value = `${selectedItem.dir}/${selectedItem.value}`
                setSelectedFileFolder(selected_value)
            }
        }
    }

    useEffect(() => {
        handleLoadDirData()
    }, [selectedFileFolder])

    const ITEM_HEIGHT = 30;

    const PER_PAGE = () => {
        const modalH = (APP_HEIGHT * 0.8) - 70; // modal less header
        return Math.floor(modalH / (ITEM_HEIGHT + 1));
    }

    const handleSetPageItems = (direction = "") => {

        if (direction === "START") {
            const le_value = dirData.slice(0, PER_PAGE()).map((game) => {
                return {
                    ...game,
                    selected: game.index === 0
                }
            })
            setPageItems(le_value)
            return
        }

        if (dirData.length) {

            const size_page = pageItems.length;
            const first_item = pageItems[0];
            const last_item = pageItems[size_page - 1];
            const selected = pageItems.find(g => g.selected);

            if (!selected) {
                return;
            }

            if (direction === "UP") {

                if (selected.index !== 0) {

                    // check if it is not the first of the list
                    if (selected.index !== first_item.index) {

                        const currentIndex = pageItems.findIndex(g => g.selected)

                        setPageItems(pageItems?.map(game => {
                            return {
                                ...game,
                                selected: pageItems[currentIndex - 1].index === game.index
                            }
                        }))
                    } else {
                        setPageItems(dirData.slice(first_item.index - 1, first_item.index - 1 + PER_PAGE()).map((game) => {
                            return {
                                ...game,
                                selected: game.index === first_item.index - 1
                            }
                        }))
                    }
                } else {
                    // console.log("No more items UP")
                }
            } else if (direction === "DOWN") {

                if (selected.index !== last_item.index) {
                    const currentIndex = pageItems.findIndex(g => g.selected)

                    const nuevo = pageItems?.map(game => {
                        return {
                            ...game,
                            selected: pageItems[currentIndex + 1].index === game.index
                        }
                    })

                    setPageItems(nuevo)

                } else {
                    // check if has more items
                    if (last_item.index < (dirData.length - 1)) {

                        setPageItems(dirData.slice(first_item.index + 1, first_item.index + 1 + PER_PAGE()).map((game) => {
                            return {
                                ...game,
                                selected: game.index === selected.index + 1
                            }
                        }))

                    } else {
                        // console.log("No more itens to scroll")
                    }
                }
            }
        }
    }

    useEffect(() => {
        handleSetPageItems("START")
    }, [dirData])

    const handleNavigation = (direction = "") => {
        switch (direction) {
            case "UP":
                handleSetPageItems("UP")
                break;
            case "DOWN":
                handleSetPageItems("DOWN")
                break;
            default:
                break
        }
    }

    useImperativeHandle(ref, () => ({

        listenInput: (keyCode) => {

            if ([...keyMap.P1_A, ...keyMap.P2_A].some(key => key === keyCode)) {
                handleSelectItem()
            } else if ([...keyMap.P1_B, ...keyMap.P2_B].some(key => key === keyCode)) {
                setFolderIsOpen(false)
            } else if (keyMap.upKeyCode.some(key => key === keyCode)) {
                handleNavigation("UP")
            } else if (keyMap.downKeyCode.some(key => key === keyCode)) {
                handleNavigation("DOWN")
            } else if ([...keyMap.P1_START, ...keyMap.P2_START].some(key => key === keyCode)) {
                handleSelectItem(true)
            }
        }

    }));

    return (
        <View
            style={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                height: APP_HEIGHT,
                width: APP_WIDTH

            }}>
            {/* Modal  */}
            <View style={{
                width: APP_WIDTH * 0.8,
                height: APP_HEIGHT * 0.8,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderWidth: 1,
            }}

            >
                {/*  Header */}
                <View style={{
                    height: 50,
                    width: "100%",
                    backgroundColor: "#2D3748",
                }}>
                    <Text style={{ color: "#ffff", margin: "auto", fontSize: 20 }}> File Browser : {selectedFileFolder} {PER_PAGE()}</Text>
                </View>

                {/*  Body */}
                <View style={{
                    width: APP_WIDTH * 0.8,
                    height: (APP_HEIGHT * 0.8) - 50,
                    flexGrow: 1,
                    backgroundColor: "#F7FAFC",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    borderWidth: 2
                }}
                >
                    {pageItems.map(data => {
                        return (
                            <TouchableOpacity key={data.value}

                                style={{
                                    height: ITEM_HEIGHT,
                                    width: (APP_WIDTH * .8) - 15,
                                    margin: 1,
                                    display: "flex",
                                    flexDirection: "row",
                                }}

                                onPress={() => handleSelectItem()}
                            >

                                <View style={{
                                    width: ITEM_HEIGHT,
                                    height: ITEM_HEIGHT,
                                    backgroundColor: data.type === "dir" ? "#90CDF4" : "#FAF089",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                }}>
                                    <Text >{data.type === "dir" ? "D" : "F"}</Text>
                                </View>
                                <Text style={{
                                    overflow: "hidden",
                                    padding: 5,
                                    flexGrow: 1,
                                    backgroundColor:
                                        data.index % 2 === 0 ?
                                            data.selected ?
                                                '#C6F6D5' : '#EDF2F7' :
                                            data.selected ?
                                                '#C6F6D5' : '#E2E8F0'
                                }}>
                                    {data.value}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}

                </View>

               
            </View>
        </View>
    )
})
