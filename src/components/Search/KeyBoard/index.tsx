import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { KeyBoardData } from "./layout_keys/main"

import { useSettingsContext } from "../../../hooks/useSettings"
import { useKeyboardContext } from "../../../hooks/keyboardHook"
import { KeyboardKeyProps } from '../../../utils/types';

interface KeyBoardProps {
    keyboardActiveRef: any
}


export const KeyBoard = forwardRef((
    {
        keyboardActiveRef
    }: KeyBoardProps,
    ref
) => {

    const { chakraColors, themeColor, keyMap } = useSettingsContext()
    const { setSearchText, searchText, setKeyBoardHeight, setKeyboardActive } = useKeyboardContext()

    const onLayout = (event : LayoutChangeEvent ) => {
        const {height} = event.nativeEvent.layout;
        setKeyBoardHeight(height)
    }
    
    const [keyboardTable, setKeyboardTable] = useState<KeyboardKeyProps[]>([])

    const loadKeyboardTable = () => {
        let preData : KeyboardKeyProps[] = [];
        KeyBoardData.order.forEach((e , i) => {
            const key = e as keyof typeof KeyBoardData.keys
            const el = KeyBoardData.keys[key];

            if (!el?.x) {
                console.log("Undefined key", el, e)
            }

            preData.push({
                key: key,
                x: el.x,
                y: el.y,
                type: el.type,
                size: el.size,
                selected: i === 0 ? true : false
            });
        });

        setKeyboardTable(preData);

    };

    useEffect(() => {
        loadKeyboardTable();
    }, []);


    const handleKeyNavigation = (direction: string) => {

        const previousSelectedKey = keyboardTable.find(k => k.selected)

        if (!previousSelectedKey) {
            return
        }

        const currentRow = keyboardTable.filter(k => k.y == previousSelectedKey.y)
        const rowAbove = keyboardTable.filter(k => k.y == previousSelectedKey.y - 1)
        const rowBelow = keyboardTable.filter(k => k.y == previousSelectedKey.y + 1)
        const lastKeyRow = currentRow[currentRow.length - 1]
        const firstKeyRow = currentRow[0]

        if (direction === "RIGHT") {
            if (previousSelectedKey.x < lastKeyRow.x) {
                const updatedTable = keyboardTable.map(item => {
                    if (item.x == previousSelectedKey.x + 1 && item.y === previousSelectedKey.y) {
                        return {
                            ...item,
                            selected: true
                        }
                    } else {
                        return {
                            ...item,
                            selected: false
                        }
                    }
                })
                setKeyboardTable(updatedTable)
            }
        } else if (direction === "LEFT") {
            if (previousSelectedKey.x > firstKeyRow.x) {
                const updatedTable = keyboardTable.map(item => {
                    if (item.x == previousSelectedKey.x - 1 && item.y === previousSelectedKey.y) {
                        return {
                            ...item,
                            selected: true
                        }
                    } else {
                        return {
                            ...item,
                            selected: false
                        }
                    }
                })
                setKeyboardTable(updatedTable)
            } else {
                keyboardActiveRef.current = false
                setKeyboardActive(keyboardActiveRef.current)
            }
        } else if (direction === "DOWN") {
            if (rowBelow.length) {
                let new_x =
                    rowBelow
                        .filter(r => r?.x <= previousSelectedKey?.x)
                        .map(m => m?.x)
                        .reduce((acc, cur) => {
                            acc = cur > acc ? cur : acc
                            return acc
                        }, 1);

                const updatedTable = keyboardTable.map(item => {
                    if (item.x == new_x && item.y === previousSelectedKey.y + 1) {
                        return {
                            ...item,
                            selected: true
                        }
                    } else {
                        return {
                            ...item,
                            selected: false
                        }
                    }
                })
                setKeyboardTable(updatedTable)
            }
        } else if (direction === "UP") {
            if (rowAbove.length) {
                let new_x =
                    rowAbove
                        .filter(r => r?.x <= previousSelectedKey?.x)
                        .map(m => m?.x)
                        .reduce((acc, cur) => {
                            acc = cur > acc ? cur : acc
                            return acc
                        }, 1);
                const updatedTable = keyboardTable.map(item => {
                    if (item.x == new_x && item.y === previousSelectedKey.y - 1) {
                        return {
                            ...item,
                            selected: true
                        }
                    } else {
                        return {
                            ...item,
                            selected: false
                        }
                    }
                })
                setKeyboardTable(updatedTable)
            }
        }

    }

    const handlePressKey = (pressedKey: string) => {

        const currentKey = keyboardTable.find(k => k.selected)

        if (pressedKey === "A") {
            if (currentKey) {
                if (currentKey?.type === "standard") {
                    setSearchText(searchText.concat(currentKey.key))
                } else if (currentKey?.type === "delete") {
                    setSearchText(searchText.slice(0, -1))
                } else if (currentKey?.type === "confirm") {
                    keyboardActiveRef.current = false
                    setKeyboardActive(keyboardActiveRef.current)
                } else if (currentKey?.type === "space") {
                    setSearchText(searchText.concat(" "))
                }

            }
        } else if (pressedKey === "B") {
            setSearchText(searchText.slice(0, -1))
        } else if (pressedKey === "C"){
            setSearchText(searchText.concat(" "))
        }

    }

    useImperativeHandle(ref, () => ({

        listenInput: (keyCode: number) => {

            if ([...keyMap.P1_A, ...keyMap.P2_A].some(key => key === keyCode)) {
                handlePressKey("A")
            } else if ([...keyMap.P1_B, ...keyMap.P2_B].some(key => key === keyCode)) {
                handlePressKey("B")
            } else if ([...keyMap.P1_C, ...keyMap.P2_C].some(key => key === keyCode)) {
                handlePressKey("C")
            } else if (keyMap.upKeyCode.some(key => key === keyCode)) {
                handleKeyNavigation("UP")
            } else if (keyMap.downKeyCode.some(key => key === keyCode)) {
                handleKeyNavigation("DOWN")
            } else if (keyMap.leftKeyCode.some(key => key === keyCode)) {
                handleKeyNavigation("LEFT")

            } else if (keyMap.rightKeyCode.some(key => key === keyCode)) {
                handleKeyNavigation("RIGHT")

            } else if ([...keyMap.P1_START, ...keyMap.P2_START].some(key => key === keyCode)) {
                handlePressKey("START")
            }
        }

    }));


    const colorsBg = keyboardActiveRef.current ?
        [chakraColors.gray[8], chakraColors.gray[7], chakraColors.gray[6]] :
        [chakraColors.gray[6], chakraColors.gray[5], chakraColors.gray[4]]

    return (
        <LinearGradient

            onLayout={onLayout}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            colors={colorsBg}
            style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", width: '100%' }}>

            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", height: 40, backgroundColor: chakraColors.gray[2] }}>
                <Text style={{
                    color: searchText.trim().length > 0 ? chakraColors.gray[9] : chakraColors.gray[5],
                    fontSize: searchText.trim().length > 0 ? 20 : 30,

                }} > {searchText.trim().length > 0 ? searchText : "START TYPING"} </Text>
            </View>
            <View
                style={{ flexDirection: "column", width: '100%' }}
            >

                {
                    Array(KeyBoardData.lines).fill(0).map((_, r) => {
                        const row = r + 1;

                        return (
                            <View key={`row_${row}`} >
                                <View style={{ flexDirection: "row" }}>


                                    {keyboardTable.filter(f => f.y === row).map((key, k_index) => {

                                        let btBgColor = themeColor[2];

                                        if (key.type === "confirm"){
                                            btBgColor = chakraColors.blue[1]
                                        } else if (key.type === "delete"){
                                            btBgColor = chakraColors.red[1]
                                        } else if (key.type === "space"){
                                            btBgColor = themeColor[0]
                                        }

                                        return (

                                            <View key={`row_${row}_key_${k_index}`}
                                                style={{
                                                    borderWidth: 1,
                                                    alignContent: "center",
                                                    flex: key.size,
                                                    backgroundColor: key.selected ?
                                                        themeColor[5] :
                                                        btBgColor
                                                }}
                                            >
                                                <Text style={{
                                                    textAlign: "center"
                                                }}>{key.key}</Text>
                                            </View>

                                        )
                                    })}

                                </View>

                            </View>
                        )
                    })
                }

            </View>


        </LinearGradient>
    )
})