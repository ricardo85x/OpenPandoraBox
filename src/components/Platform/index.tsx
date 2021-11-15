import React, {useEffect, useState, useRef, useMemo} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import KeyEvent from 'react-native-keyevent';

import {Utils} from '../../utils';
import {ParseGameList} from '../../utils/ParseGameList';
import {PandaConfig} from '../../utils/PandaConfig';

import {GameList} from './GameList';
import {Main} from './Main';

import {useSettingsContext} from '../../hooks/useSettings';
import {useDbContext} from '../../hooks/useDb';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  IGameList,
  IKeyEvent,
  IRomPlatform,
  SortListProps,
} from '../../utils/types';

interface PlatformProps {
  navigation: StackNavigationProp<any, any>;
  route: {
    name: string;
    params: {
      platform: {
        title: string;
        text: string;
        path: string;
      };
    };
  };
}

export enum LOADING_STATUS {
  LOADING,
  LOADED,
}

export const Platform = ({navigation, route}: PlatformProps) => {
  const {db} = useDbContext();

  const {decodeText} = Utils();

  const {APP_WIDTH, APP_HEIGHT, keyMap, appSettings} = useSettingsContext();

  const ITEM_SIZE = 50;
  const getPerItem = () => {
    return Math.floor(APP_HEIGHT / ITEM_SIZE);
  };

  const PER_PAGE = getPerItem();

  const EXTRA_SPACE = APP_HEIGHT - PER_PAGE * ITEM_SIZE;

  const {
    params: {platform},
  } = route;

  const {title, text, path} = platform;

  const [page, setPage] = useState<IRomPlatform[]>([]);
  const pageRef = useRef<IRomPlatform[]>([]);
  const gamesRef = useRef<IRomPlatform[]>([]);

  const [, setSortList] = useState<SortListProps[]>([]);
  const sortListRef = useRef<SortListProps[]>([]);

  const onBackgroundRef = useRef(false);
  const [onBackground, setOnBackground] = useState(false);

  const LOADING_REF = useRef(LOADING_STATUS.LOADING);
  const [LOADING, SET_LOADING] = useState(LOADING_STATUS.LOADING);

  const isLoadingPageRef = useRef(false);
  // const [isLoadingPage, setIsLoadingPage] = useState(isLoadingPageRef);

  const updateLoading = (status: LOADING_STATUS) => {
    LOADING_REF.current = status;
    SET_LOADING(LOADING_REF.current);
  };

  const rangeRef = useRef({
    current: {
      start: 0,
      end: PER_PAGE,
    },
    previous: {
      start: -1,
      end: -1,
    },
  });

  // const getRange = (start:number, end:number) => new Array(end-start+1).fill(0).map((el, ind) => ind + start);

  const readGameDBRange = async (
    start: number,
    end: number,
  ): Promise<IRomPlatform[]> => {
    isLoadingPageRef.current = true;
    let dbRoms: IRomPlatform[] = [];



    try {
      const ids: number[] = sortListRef.current
        .slice(start, start + end)
        .map((v) => v.id);


      if (rangeRef.current.previous.start !== -1) {


        if (
          start == rangeRef.current.previous.start + 1 &&
          end == rangeRef.current.previous.end
        ) {

          const missingRom =
            ((await db?.loadRomsFromPlatformOffsetLimitNew(
              path,
              start + end - 1,
              1,
              [ids[ids.length - 1]],
            )) as IRomPlatform[]) ?? [];

          dbRoms = [...pageRef.current.slice(1), ...missingRom];
        } else if (
          start == rangeRef.current.previous.start - 1 &&
          end == rangeRef.current.previous.end &&
          start
        ) {

          const missingRom =
            ((await db?.loadRomsFromPlatformOffsetLimitNew(path, start, 1, [
              ids[0],
            ])) as IRomPlatform[]) ?? [];

          dbRoms = [
            ...missingRom,
            ...pageRef.current.slice(0, pageRef.current.length - 1),
          ];
        } else {

         dbRoms =
          ((await db?.loadRomsFromPlatformOffsetLimitNew(
            path,
            start,
            end,
            ids,
          )) as IRomPlatform[]) ?? [];
       }
      } else {

        dbRoms =
          ((await db?.loadRomsFromPlatformOffsetLimitNew(
            path,
            start,
            end,
            ids,
          )) as IRomPlatform[]) ?? [];

          
      }

      rangeRef.current.previous = {
        start,
        end,
      };

    } catch (e) { console.error("readGameDBRange",e) }



    isLoadingPageRef.current = false;

    return dbRoms;
  };

  const readFromDb = async () => {
    if (!db) {
    
      return false;
    }



    const _pages = await readGameDBRange(0, PER_PAGE);



    if (!!_pages && !!_pages.length) {


      pageRef.current = _pages.map((game, i) => {
        return {
          ...game,
          selected: i === 0,
        };
      });

      setPage(pageRef.current);

      const _size = await db.sizeRomPlatform(path);

      if (!!_size && Number(_size) !== NaN) {
        const _storageGames = [...new Array(_size)].map((g, i) => {
          return {
            id: i,
          } as IRomPlatform;
        });

        if (!!_storageGames && !!_storageGames.length) {
          gamesRef.current = _storageGames;
          return true;
        }
      }
    }

    return false;
  };

  const readGameList = async (reload = false) => {
    updateLoading(LOADING_STATUS.LOADING);

    pageRef.current = []
    setPage(pageRef.current);

    if (!db) {
      updateLoading(LOADING_STATUS.LOADED);
      return;
    }

    try {
      if (!reload) {



        if (sortListRef.current.length === 0) {
          sortListRef.current = await db.getSortList(path);
          setSortList(sortListRef.current);
        }

        if (await readFromDb()) {
          KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) =>
            ListenKeyBoard(keyEvent),
          );

          updateLoading(LOADING_STATUS.LOADED);

          return;
        }


      }


      if (title === 'All') {
        updateLoading(LOADING_STATUS.LOADED);
        return;
      }


      const parseGameList = ParseGameList();
      const jsonGame = await parseGameList.getJsonData(`${path}/gamelist.xml`);
      const {gameList} = jsonGame;

      let gamesRef_current = [];

      if (gameList) {
        let cur_id = 0;

        let preData: IGameList[] = [];

        if ((gameList as any)?.game?.path) {
          preData = [(gameList as any).game as IGameList];
        } else if (gameList?.game) {
          preData = gameList.game;
        } else {
          updateLoading(LOADING_STATUS.LOADED);
          return;
        }

        gamesRef_current = preData
          // .sort((a, b) => b.name.localeCompare(a.name))
          .filter((game) => !!game?.path?.substr)
          .reduce((acc, game) => {
           

            try {
              const data_ = {
                path: decodeText(`${path}${game?.path?.substr(1)}`),
                thumbnail: decodeText(
                  `file:///${path}${game?.thumbnail?.substr(1)}`,
                ),
                image: decodeText(`file:///${path}${game?.image?.substr(1)}`),
                desc: decodeText(game?.desc),
                video: decodeText(`file:///${path}${game?.video?.substr(1)}`),
                name: decodeText(game?.name),
                sortId: cur_id,
                id: cur_id,
                loadVideo: false,
              };

              acc.push(data_);
              cur_id++;
            } catch (e) {
              console.error('ERROR ADDING ROM', e, game);
            }

            return acc;
          }, [] as IRomPlatform[])
          .map((g) => {
            return {
              ...g,
              romName:
                g?.path && !!g.path.split('/').length
                  ? g.path.split('/')[g.path.split('/').length - 1]
                  : '',
              favorite: false,
            };
          });

        await db.cleanPlatform(path);

        await db.addRoms(
          gamesRef_current.map((g) => {
            return {
              ...g,
              platform: path,
            };
          }),
        );


        if (sortListRef.current.length === 0) {
          sortListRef.current = await db.getSortList(path);
          setSortList(sortListRef.current);
        }



        await readFromDb();

        updateLoading(LOADING_STATUS.LOADED);
      } else {
      }
    } catch (err) {
      console.error('Error loading game list', err);
      updateLoading(LOADING_STATUS.LOADED);

      // KeyEvent.onKeyDownListener((keyEvent) => ListenKeyBoard(keyEvent));
    }
  };

  useEffect(() => {
    const loadGameList = async () => {
      try {
        await readGameList();
        KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) =>
          ListenKeyBoard(keyEvent),
        );
      } catch {
        KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) =>
          ListenKeyBoard(keyEvent),
        );
      }
    };

    loadGameList();
  }, []);

  useEffect(() => {
    onBackgroundRef.current = false;
    setOnBackground(onBackgroundRef.current);
  }, [page]);

  const handleAddFavorites = async () => {
    const selectedGameNow = pageRef.current.find((g) => g.selected);

    if (!!db && selectedGameNow?.id && selectedGameNow?.path) {
      let platform_path = path;
      if (platform_path == 'All') {
        platform_path = selectedGameNow.path
          .split('/')
          .slice(0, selectedGameNow.path.split('/').length - 1)
          .join('/');
      }

      const isFavorite = await db.setFavorite(
        selectedGameNow.id!,
        platform_path,
      );

      pageRef.current = pageRef.current.map((page) => {
        if (
          page.id! === selectedGameNow.id &&
          page.path === selectedGameNow.path
        ) {
          return {
            ...page,
            favorite: isFavorite,
          };
        }
        return page;
      });

      setPage(pageRef.current);
    }
  };

  const ListenKeyBoard = (keyEvent: IKeyEvent) => {
    if (keyMap.upKeyCode?.includes(keyEvent.keyCode)) {
      handleSelection('UP');
    }

    if (keyMap.downKeyCode?.includes(keyEvent.keyCode)) {
      handleSelection('DOWN');
    }

    if (keyMap.leftKeyCode?.includes(keyEvent.keyCode)) {
      handleSelection('LEFT');
    }

    if (keyMap.rightKeyCode?.includes(keyEvent.keyCode)) {
      handleSelection('RIGHT');
    }

    if (
      keyMap.P1_A?.includes(keyEvent.keyCode) ||
      keyMap.P2_A?.includes(keyEvent.keyCode)
    ) {
      handleRunGame();
    }

    if (
      keyMap.P1_C?.includes(keyEvent.keyCode) ||
      keyMap.P2_C?.includes(keyEvent.keyCode)
    ) {
      // console.log("KEY C")
      // handleSelection('BUTTON_C');
    }

    if (
      keyMap.P1_F?.includes(keyEvent.keyCode) ||
      keyMap.P2_F?.includes(keyEvent.keyCode)
    ) {
      handleAddFavorites();

      // handleSelection('BUTTON_F');
    }

    if ([...keyMap.P1_D, ...keyMap.P2_D].includes(keyEvent.keyCode)) {
      // console.log("RELOAD")
      readGameList(true);
    }

    if ([...keyMap.P1_E, ...keyMap.P2_E].includes(keyEvent.keyCode)) {
      // RANDOM

      selectRandomRom();
    }

    if (keyMap.P1_B?.includes(keyEvent.keyCode)) {
      if (navigation.canGoBack()) {
        navigation.goBack();
        // console.log("BACK")
      } else {
        navigation.navigate('Home');
        // console.log("To the home")
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) =>
        ListenKeyBoard(keyEvent),
      );
      return () => {
        KeyEvent.removeKeyDownListener();
        onBackgroundRef.current = true;
        setOnBackground(onBackgroundRef.current);
      };
    }, []),
  );

  const selectRandomRom = async () => {
    const first = Math.floor(Math.random() * gamesRef.current.length - 1);

    pageRef.current = (await readGameDBRange(first, PER_PAGE)).map((game) => {
      return {
        ...game,
        selected: game.sortId === first,
      };
    });

    setPage(pageRef.current);
  };

  const handleRunGame = () => {
    const selectedGameNow = pageRef.current.find((g) => g.selected);
    if (selectedGameNow?.path && db) {
      const pandaConfig = PandaConfig();

      let platform_name = text;

      if (text == 'All') {
        platform_name =
          selectedGameNow.path.split('/')[
            selectedGameNow.path.split('/').length - 2
          ];
      }

      pandaConfig.runGame({rom: selectedGameNow.path, platform: platform_name});
      onBackgroundRef.current = true;
      setOnBackground(onBackgroundRef.current);

      db.addHistory(selectedGameNow.id!, path);
    }
  };

  const handleSelection = async (direction: string) => {
    if (pageRef.current.length) {
      if (isLoadingPageRef.current) {
        console.warn('still fetching');
        return;
      }

      const size_page = pageRef.current.length;
      const first_item = pageRef.current[0];
      const last_item = pageRef.current[size_page - 1];
      const selected = pageRef.current.find((g) => g.selected);

      if (!selected) {
        return;
      }

      if (direction === 'UP') {
        if (selected.sortId! !== 0) {
          // check if it is not the first of the list
          if (selected.sortId! !== first_item.sortId!) {
            const currentIndex = pageRef.current.findIndex((g) => g.selected);
            pageRef.current = pageRef.current.map((game) => {
              return {
                ...game,
                selected:
                  pageRef.current[currentIndex - 1].sortId! === game.sortId!,
              };
            });

            setPage(pageRef.current);
          } else {
            pageRef.current = (
              await readGameDBRange(first_item.sortId! - 1, PER_PAGE)
            ).map((game) => {
              return {
                ...game,
                selected: game.sortId! === first_item.sortId! - 1,
              };
            });

            setPage(pageRef.current);
          }
        } else {
          const first =
            gamesRef.current.length - 1 - PER_PAGE >= 0
              ? gamesRef.current.length - 1 - PER_PAGE
              : 0;

          const last = gamesRef.current.length - 1;

          pageRef.current = (await readGameDBRange(first, PER_PAGE)).map(
            (game) => {
              return {
                ...game,
                selected: game.sortId! === last - 1,
              };
            },
          );

          setPage(pageRef.current);
        }
      } else if (direction === 'DOWN') {
        if (selected.sortId! !== last_item.sortId!) {
          const currentIndex = pageRef.current.findIndex((g) => g.selected);
          pageRef.current = pageRef.current.map((game) => {
            return {
              ...game,
              selected:
                pageRef.current[currentIndex + 1].sortId! === game.sortId!,
            };
          });

          setPage(pageRef.current);
        } else {
          // check if has more items

          if (last_item.sortId! < gamesRef.current.length - 1) {

            pageRef.current = (
              await readGameDBRange(first_item.sortId! + 1, PER_PAGE)
            ).map((game) => {
              return {
                ...game,
                selected: game.sortId! === selected.sortId! + 1,
              };
            });

            setPage(pageRef.current);
          } else {

            pageRef.current = (await readGameDBRange(0, PER_PAGE)).map(
              (game) => {
                return {
                  ...game,
                  selected: game.sortId! === 0,
                };
              },
            );

            setPage(pageRef.current);
          }
        }
      } else if (direction === 'RIGHT') {
        if (last_item.sortId! < gamesRef.current.length - 1) {
          const last_id =
            last_item.sortId! + PER_PAGE < gamesRef.current.length - 1
              ? last_item.sortId! + PER_PAGE
              : gamesRef.current.length - 1;

          pageRef.current = (
            await readGameDBRange(last_id - PER_PAGE, PER_PAGE)
          ).map((game) => {
            return {
              ...game,
              selected: game.sortId! === last_id - 1,
            };
          });

          setPage(pageRef.current);
        }
      } else if (direction === 'LEFT') {
        // check if it is not the first of the list
        if (0 !== first_item.sortId!) {
          const first_id =
            first_item.sortId! - PER_PAGE > 0
              ? first_item.sortId! - PER_PAGE
              : 0;

          pageRef.current = (await readGameDBRange(first_id, PER_PAGE)).map(
            (game) => {
              return {
                ...game,
                selected: game.sortId! === first_id,
              };
            },
          );

          setPage(pageRef.current);
        }
      }
    }
  };

  const selectedGame = useMemo(() => {
    return pageRef.current.find((g) => g.selected);
  }, [page]);

  const buttonAction = (buttonName: string) => {
    switch (buttonName) {
      case 'A':
        handleRunGame();
        break;
      case 'B':
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Home');
        }
        break;
      case 'C':
        // handleSelection('BUTTON_C');
        break;
      case 'D':
        readGameList(true);
        break;
      case 'E':
        selectRandomRom();
        break;
      case 'F':
        handleAddFavorites();
        break;
      default:
        break;
    }
  };

  const currentTitle = useMemo(() => {
    if (selectedGame?.path) {
      const platform_name =
        selectedGame.path.split('/')[selectedGame.path.split('/').length - 2];
      if (Object.keys(appSettings.PLATFORMS).includes(platform_name)) {
        return appSettings?.PLATFORMS[platform_name]?.title ?? 'All';
      }
    }

    return text;
  }, [selectedGame]);

  return (
    <>
      <SafeAreaView>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#1A202C', '#2D3748', '#4A5568']}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: APP_WIDTH,
            height: APP_HEIGHT,
          }}>
          <GameList
            LOADING={LOADING}
            EXTRA_SPACE={EXTRA_SPACE}
            games={pageRef.current}
          />
          <Main
            buttonAction={buttonAction}
            title={currentTitle}
            onBackground={onBackground}
            selectedGame={selectedGame}
          />
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};
