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
import {IGameList, IKeyEvent, IRomPlatform} from '../../utils/types';

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

export const Platform = ({navigation, route}: PlatformProps) => {
  const {db} = useDbContext();

  const {decodeText} = Utils();

  const {APP_WIDTH, APP_HEIGHT, keyMap} = useSettingsContext();

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

  const onBackgroundRef = useRef(false);
  const [onBackground, setOnBackground] = useState(false);

  const readGameDBRange = async (
    start: number,
    end: number,
  ): Promise<IRomPlatform[]> => {
    const _dbRoms =
      ((await db?.loadRomsFromPlatformOffsetLimit(
        path,
        start,
        end,
      )) as IRomPlatform[]) ?? [];
    return _dbRoms;
  };

  const readFromDb = async () => {

    if (!db) {
        return;
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

    return false
  };

  const readGameList = async (reload = false) => {
    if (!db) {
      return;
    }

    let lastGame;

    try {
      if (!reload) {

        if (await readFromDb()){
            KeyEvent.onKeyDownListener((keyEvent: IKeyEvent) =>
                ListenKeyBoard(keyEvent),
            );
            return;
        }
        
      }

      const parseGameList = ParseGameList();
      const jsonGame = await parseGameList.getJsonData(`${path}/gamelist.xml`);
      const {gameList} = jsonGame;

      let gamesRef_current = [];

      if (gameList) {
        let cur_id = 0;

        let preData : IGameList[] = []

        if(((gameList) as any )?.game?.path){
          preData = [(gameList as any).game as IGameList]

        } else if(gameList?.game) {
          preData = gameList.game

        } else {

          return
        }



        gamesRef_current = preData
          // .sort((a, b) => b.name.localeCompare(a.name))
          .filter((game) => !!game?.path?.substr)
          .reduce((acc, game) => {
            lastGame = game;

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
              console.log('ERROR ADDING ROM', e, game);
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

        await readFromDb()

        
        
      } else {
      }
    } catch (err) {
      console.log('Error loading game list', err);
      console.log('Last Game', lastGame);
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

  const ListenKeyBoard = (keyEvent: IKeyEvent) => {
    if (keyMap.upKeyCode?.includes(keyEvent.keyCode)) {
      handleSelection('UP');
    }

    if (keyMap.downKeyCode?.includes(keyEvent.keyCode)) {
      handleSelection('DOWN');
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
      handleSelection('BUTTON_C');
    }

    if (
      keyMap.P1_F?.includes(keyEvent.keyCode) ||
      keyMap.P2_F?.includes(keyEvent.keyCode)
    ) {
      // console.log("KEY F")
      handleSelection('BUTTON_F');
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
    if (selectedGameNow && db) {
      const pandaConfig = PandaConfig();
      pandaConfig.runGame({rom: selectedGameNow.path!, platform: text});
      onBackgroundRef.current = true;
      setOnBackground(onBackgroundRef.current);

      db.addHistory(selectedGameNow.id!, path);
    }
  };

  const handleSelection = async (direction: string) => {
    if (pageRef.current.length) {
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

          pageRef.current = (await readGameDBRange(first, PER_PAGE)).map((game) => {
            return {
              ...game,
              selected: game.sortId! === last - 1,
            };
          });

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
            pageRef.current = (await readGameDBRange(0, PER_PAGE)).map((game) => {
              return {
                ...game,
                selected: game.sortId! === 0,
              };
            });

            setPage(pageRef.current);
          }
        }
      } else if (direction === 'BUTTON_F') {
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
      } else if (direction === 'BUTTON_C') {
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
        handleSelection('BUTTON_C');
        break;
      case 'D':
        readGameList(true);
        break;
      case 'E':
        selectRandomRom();
        break;
      case 'F':
        handleSelection('BUTTON_F');
        break;
      default:
        break;
    }
  };

  // console.log("N_ITEMS", pageRef.current.length)

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
            // backgroundColor: "#4A5568"
          }}>
          <GameList EXTRA_SPACE={EXTRA_SPACE} games={pageRef.current} />
          <Main
            buttonAction={buttonAction}
            title={title}
            onBackground={onBackground}
            selectedGame={selectedGame}
          />
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};
