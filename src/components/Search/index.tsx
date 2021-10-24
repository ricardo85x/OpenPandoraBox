import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import KeyEvent from 'react-native-keyevent';

import { useSettingsContext } from "../../hooks/useSettings";
import { PandaConfig } from "../../utils/PandaConfig"

import { GameList } from "./GameList"
import { Main } from "./Main"

import { useDbContext } from "../../hooks/useDb"
import { useKeyboardContext } from "../../hooks/keyboardHook"
import { StackNavigationProp } from '@react-navigation/stack';
import { IKeyEvent, IRomSearch } from '../../utils/types';

interface SearchProps {
    navigation: StackNavigationProp<any, any>
}

export const Search = ({ navigation }: SearchProps) => {

    const { db } = useDbContext();
    const { searchText, setKeyboardActive, keyboardActiveRef } = useKeyboardContext()

    const keyboardRef = useRef<any>();




    const { APP_WIDTH, APP_HEIGHT, keyMap, chakraColors } = useSettingsContext()

    const ITEM_SIZE = 50;
    const getPerItem = () => {
        return Math.floor(APP_HEIGHT / (ITEM_SIZE));
    }

    const PER_PAGE = getPerItem();

    const EXTRA_SPACE = APP_HEIGHT - ((PER_PAGE) * ITEM_SIZE)

    const [page, setPage] = useState<IRomSearch[]>([])

    const pageRef = useRef<IRomSearch[]>([]);
    const gamesRef = useRef<IRomSearch[]>([]);

    const onBackgroundRef = useRef(false)
    const [onBackground, setOnBackground] = useState(false)

    const readGameDB = async (start: number, end: number) => {
        return gamesRef.current.slice(start, start+end)
    }

    useEffect(() => {
        readGameList()
    }, [searchText])

    const readGameList = async () => {

        if(!db) {
            return
        }

        const pandaConfig = PandaConfig();

        const baseConfig = await pandaConfig.dirConfig()

        gamesRef.current = (await db.searchRom(searchText)).map((game, id) => {

            const platform_name = game.platform.split('/')[game.platform.split('/').length - 1]
            const platformTitle = baseConfig?.PLATFORMS[platform_name]?.title ?? platform_name;

            return {
                path: game?.path,
                thumbnail: game?.thumbnail,
                image: game?.image,
                desc: game?.desc,
                video: game?.video,
                name: game?.name,
                id: id,
                gameId: game?.id,
                loadVideo: false,
                platform: game?.platform,
                platformTitle: platformTitle
            }
        }).map(g => {
            return {
                ...g,
                romName: !!g.path.split('/').length ?
                    g.path.split('/')[g.path.split('/').length - 1] : ""
            }
        })


        pageRef.current = gamesRef.current.slice(0, PER_PAGE).map((game, i) => {
            return {
                ...game,
                selected: i === 0
            }
        })

        setPage(pageRef.current)
        KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) => ListenKeyBoard(keyEvent));
    }

    useEffect(() => {
        readGameList()
    }, [])


    useEffect(() => {
        onBackgroundRef.current = false
        setOnBackground(onBackgroundRef.current)

    }, [page])

    const ListenKeyBoard = (keyEvent: IKeyEvent) => {
        if(keyboardActiveRef === undefined) {
            return
        }

        if (keyboardActiveRef?.current) {

            keyboardRef.current?.listenInput(keyEvent.keyCode)
      
        } else {

            if (keyMap.upKeyCode?.includes(keyEvent.keyCode)) {
                handleSelection("UP")
            }
    
            if (keyMap.downKeyCode?.includes(keyEvent.keyCode)) {
                handleSelection("DOWN")
            }

            if (keyMap.rightKeyCode?.includes(keyEvent.keyCode)) {
                console.log("Pressed Right")
                
                keyboardActiveRef.current = true
                setKeyboardActive(keyboardActiveRef.current)
            }
    
            if (keyMap.P1_A?.includes(keyEvent.keyCode)
                || keyMap.P2_A?.includes(keyEvent.keyCode)
            ) {
                handleRunGame()
            }
    
            if (keyMap.P1_C?.includes(keyEvent.keyCode)
                || keyMap.P2_C?.includes(keyEvent.keyCode)
            ) {
                // console.log("KEY C")
                handleSelection("BUTTON_C")
            }
    
            if (keyMap.P1_F?.includes(keyEvent.keyCode)
                || keyMap.P2_F?.includes(keyEvent.keyCode)
            ) {
                // console.log("KEY F")
                handleSelection("BUTTON_F")
    
            }
    
    
            if (keyMap.P1_B?.includes(keyEvent.keyCode)) {
    
                if (navigation.canGoBack()) {
                    navigation.goBack()
                    // console.log("BACK")
                } else {
                    navigation.navigate('Home');
                    // console.log("To the home")
                }
            }

        }

        
    }

    useFocusEffect(
        React.useCallback(() => {
            KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) => ListenKeyBoard(keyEvent));
            return () => {
                KeyEvent.removeKeyDownListener();
                onBackgroundRef.current = true
                setOnBackground(onBackgroundRef.current)
            };
        }, [])
    );

    const handleRunGame = () => {
        const selectedGameNow = pageRef.current.find(g => g.selected);
        if (selectedGameNow && db) {
            const pandaConfig = PandaConfig();
            pandaConfig.runGame({ rom: selectedGameNow.path, platform: selectedGameNow.platform.split("/")[selectedGameNow.platform.split("/").length - 1] })
            onBackgroundRef.current = true
            setOnBackground(onBackgroundRef.current)
            db.addHistory(selectedGameNow.gameId, selectedGameNow.platform)
        }
    }

    const handleSelection = async (direction: string) => {

        if (pageRef.current.length) {

            const size_page = pageRef.current.length;
            const first_item = pageRef.current[0];
            const last_item = pageRef.current[size_page - 1];
            const selected = pageRef.current.find(g => g.selected);

            if (!selected) {
                return;
            }

            if (direction === "UP") {

                if (selected.id !== 0) {

                    // check if it is not the first of the list
                    if (selected.id !== first_item.id) {

                        const currentIndex = pageRef.current.findIndex(g => g.selected)
                        pageRef.current = pageRef.current.map(game => {
                            return {
                                ...game,
                                selected: pageRef.current[currentIndex - 1].id === game.id
                            }
                        })

                        setPage(pageRef.current)
                    } else {

                        pageRef.current = (await readGameDB(first_item.id - 1, PER_PAGE)).map((game) => {
                            return {
                                ...game,
                                selected: game.id === first_item.id - 1
                            }
                        })

                        setPage(pageRef.current)
                    }
                } else {

                    const first = (gamesRef.current.length - 1 - PER_PAGE) >= 0 ?
                        (gamesRef.current.length - 1 - PER_PAGE) : 0

                    const last = gamesRef.current.length - 1

                    pageRef.current = (await readGameDB(first, PER_PAGE)).map((game) => {
                        return {
                            ...game,
                            selected: game.id === last - 1
                        }
                    })

                    setPage(pageRef.current)

                }
            } else if (direction === "DOWN") {
                if (selected.id !== last_item.id) {
                    const currentIndex = pageRef.current.findIndex(g => g.selected)
                    pageRef.current = pageRef.current.map(game => {
                        return {
                            ...game,
                            selected: pageRef.current[currentIndex + 1].id === game.id
                        }
                    })

                    setPage(pageRef.current)

                } else {
                    // check if has more items
                   
                    if (last_item.id < (gamesRef.current.length - 1)) {

                        pageRef.current = (await readGameDB(first_item.id + 1, PER_PAGE)).map((game) => {
                            return {
                                ...game,
                                selected: game.id === selected.id + 1
                            }
                        })

                       setPage(pageRef.current)

                    } else {

                        pageRef.current = (await readGameDB(0, PER_PAGE)).map((game) => {
                            return {
                                ...game,
                                selected: game.id === 0
                            }
                        })

                        setPage(pageRef.current)

                    }
                }
            } else if (direction === "BUTTON_F") {

                if (last_item.id < (gamesRef.current.length - 1)) {
                    const last_id = ((last_item.id + PER_PAGE) < (gamesRef.current.length - 1)) ?
                        last_item.id + PER_PAGE :
                        (gamesRef.current.length - 1);

                    pageRef.current = (await readGameDB(last_id - PER_PAGE, PER_PAGE)).map((game) => {
                        return {
                            ...game,
                            selected: game.id === last_id - 1
                        }
                    })


                    setPage(pageRef.current)
                }

            } else if (direction === "BUTTON_C") {
                // check if it is not the first of the list
                if (0 !== first_item.id) {

                    const first_id = ((first_item.id - PER_PAGE) > 0) ?
                        first_item.id - PER_PAGE :
                        0;

                    pageRef.current = (await readGameDB(first_id, PER_PAGE)).map((game) => {
                        return {
                            ...game,
                            selected: game.id === first_id
                        }
                    })

                    setPage(pageRef.current)
                }
            }
        }
    }

    const selectedGame = useMemo(() => {
        return pageRef.current.find(g => g.selected)
    }, [page]);

    const buttonAction = (buttonName: string) => {

        switch (buttonName) {
            case "A":
                handleRunGame();
                break;
            case "B":
                if (navigation.canGoBack()) {
                    navigation.goBack()
                } else {
                    navigation.navigate('Home');
                }
                break;
            case "C":
                handleSelection("BUTTON_C");
                break;
            case "F":
                handleSelection("BUTTON_F");
                break;
            default:
                break;
        }


    }

    const colorsBg = [chakraColors.gray[8], chakraColors.gray[7], chakraColors.gray[6]]


    return (
        <>
            <SafeAreaView>
                <LinearGradient

                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}

                    colors={colorsBg}
                    style={{
                        display: 'flex',
                        flexDirection: "row",
                        width: APP_WIDTH,
                        height: APP_HEIGHT
                    }}
                >
                    <GameList keyboardActiveRef={keyboardActiveRef}   EXTRA_SPACE={EXTRA_SPACE} games={pageRef.current} />
                    <Main  keyboardActiveRef={keyboardActiveRef} keyboardRef={keyboardRef} buttonAction={buttonAction} onBackground={onBackground} selectedGame={selectedGame} />
                </LinearGradient>

            </SafeAreaView>
        </>
    )
}
