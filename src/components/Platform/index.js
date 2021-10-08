import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import KeyEvent from 'react-native-keyevent';

import { Utils } from "../../utils";
import { ParseGameList } from "../../utils/ParseGameList"
import { PandaConfig } from "../../utils/PandaConfig"

import { GameList } from "./GameList"
import { Main } from "./Main"

import { useSettingsContext } from "../../hooks/useSettings"
import { useDbContext } from "../../hooks/useDb"

export const Platform = ({ navigation, route }) => {

    const { db } = useDbContext();

    const { decodeText } = Utils()

    const { APP_WIDTH, APP_HEIGHT, keyMap } = useSettingsContext()


    const ITEM_SIZE = 50;
    const getPerItem = () => {
        return Math.floor(APP_HEIGHT / (ITEM_SIZE));
    }

    const PER_PAGE = getPerItem();

    const EXTRA_SPACE = APP_HEIGHT - ((PER_PAGE) * ITEM_SIZE)

    const { params: { platform } } = route

    const { title, text, path } = platform

    const [page, setPage] = useState([])
    const pageRef = useRef([]);
    const gamesRef = useRef([]);

    const onBackgroundRef = useRef(false)
    const [onBackground, setOnBackground] = useState(false)

    const readGameDB = async (start, end) => {
        const _dbRoms = await db.loadRomsFromPlatformOffsetLimit(path, start, end)
        return _dbRoms
    }

    const readGameList = async (reload = false) => {


        if (!reload) {

            const _pages = await readGameDB(0, PER_PAGE);

            if (!!_pages && !!_pages.length) {

                pageRef.current = _pages.map((game, i) => {
                    return {
                        ...game,
                        selected: i === 0
                    }
                })

                setPage(pageRef.current)

                const _size = await db.sizeRomPlatform(path)

                if (!!_size && Number(_size) !== NaN) {

                    const _storageGames = [...new Array(parseInt(_size))].map((g, i) => {
                        return {
                            id: i
                        }
                    })

                    if (!!_storageGames && !!_storageGames.length) {
                        gamesRef.current = _storageGames;
                        KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
                        return;
                    } else {

                    }
                } else {

                }

            }

        }

        const parseGameList = ParseGameList();
        const jsonGame = await parseGameList.getJsonData(`${path}/gamelist.xml`)
        const { gameList } = jsonGame;

        let gamesRef_current = []

        if (gameList) {

            gamesRef_current = gameList.game.sort((a, b) => a.name > b.name).map((game, id) => {
                return {
                    path: decodeText(`${path}${game?.path.substr(1)}`),
                    thumbnail: decodeText(`file:///${path}${game?.thumbnail?.substr(1)}`),
                    image: decodeText(`file:///${path}${game?.image?.substr(1)}`),
                    desc: decodeText(game?.desc),
                    video: decodeText(`file:///${path}${game?.video?.substr(1)}`),
                    name: decodeText(game?.name),
                    id: id,
                    loadVideo: false
                }
            }).map(g => {
                return {
                    ...g,
                    romName: !!g.path.split('/').length ?
                        g.path.split('/')[g.path.split('/').length - 1] : ""
                }
            })

            pageRef.current = gamesRef_current.slice(0, PER_PAGE).map((game, i) => {
                return {
                    ...game,
                    selected: i === 0
                }
            })

            setPage(pageRef.current)

            gamesRef.current = [...new Array(parseInt(gamesRef_current.length))].map((g, i) => {
                return {
                    id: i
                }
            })

            await db.cleanPlatform(path);

            await db.addRoms(gamesRef_current.map(g => {
                return {
                    ...g,
                    platform: path
                }
            }))

        } else {

        }
        KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
    }

    useEffect(() => {
        readGameList()
    }, [])


    useEffect(() => {
        onBackgroundRef.current = false
        setOnBackground(onBackgroundRef.current)

    }, [page])

    const ListenKeyBoard = (keyEvent) => {

        if (keyMap.upKeyCode?.includes(keyEvent.keyCode)) {
            handleSelection("UP")
        }

        if (keyMap.downKeyCode?.includes(keyEvent.keyCode)) {
            handleSelection("DOWN")
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

        if ([...keyMap.P1_D, ...keyMap.P2_D].includes(keyEvent.keyCode)) {
            // console.log("RELOAD")
            readGameList(true)
        }

        if ([...keyMap.P1_E, ...keyMap.P2_E].includes(keyEvent.keyCode)) {

            // RANDOM
       
           selectRandomRom();

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

    useFocusEffect(
        React.useCallback(() => {
            KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
            return () => {
                KeyEvent.removeKeyDownListener();
                onBackgroundRef.current = true
                setOnBackground(onBackgroundRef.current)
            };
        }, [])
    );


    const selectRandomRom = async () => {
        const first = Math.floor(Math.random() * gamesRef.current.length -1);
            
        pageRef.current = (await readGameDB(first, PER_PAGE)).map((game) => {
            return {
                ...game,
                selected: game.id === first
            }
        })

        setPage(pageRef.current)
    }

    const handleRunGame = () => {
        const selectedGameNow = pageRef.current.find(g => g.selected);
        if (selectedGameNow) {
            const pandaConfig = PandaConfig();
            pandaConfig.runGame({ rom: selectedGameNow.path, platform: text })
            onBackgroundRef.current = true
            setOnBackground(onBackgroundRef.current)



            db.addHistory({ id: selectedGameNow.id, platform: path })
        }
    }

    const handleSelection = async (direction) => {

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

    // console.log("N_ITEMS", pageRef.current.length)



    return (
        <>
            <SafeAreaView>
                <LinearGradient

                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}

                    colors={["#1A202C", "#2D3748", "#4A5568"]}

                    style={{
                        display: 'flex',
                        flexDirection: "row",
                        width: APP_WIDTH,
                        height: APP_HEIGHT,
                        // backgroundColor: "#4A5568"
                    }}
                >
                    <GameList EXTRA_SPACE={EXTRA_SPACE} games={pageRef.current} />
                    <Main title={title} onBackground={onBackground} selectedGame={selectedGame} />
                </LinearGradient>

            </SafeAreaView>
        </>
    )
}
