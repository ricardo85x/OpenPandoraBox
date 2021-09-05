import RNFS from "react-native-fs"
import { RunLocalCommand } from "../modules/RunLocalCommand";

export const PandaConfig = () => {

    const updateConfig = async ({ key, value }) => {

        const configFilePath = RNFS.DocumentDirectoryPath + "/config.json";
        const currentConfig = await dirConfig();

        const updatedConfig = { ...currentConfig, [key]: value }

        if (currentConfig[key] === updatedConfig[key]) {
            return false
        } 

        const updatedConfigText = JSON.stringify({...currentConfig, [key]: value}, null, 2);

        await Promise.all(RNFS.writeFile(configFilePath, updatedConfigText, 'utf8')
            .then(() => {
                console.log('RetroArch config created', configFilePath);
            })
            .catch((err) => {
                console.log("Error to create file", err.message);
            })
        );

        return true;

    }


    const baseConfig = async (configFilePath, defaultConfig) => {

        try {
            const json_config = JSON.parse(defaultConfig);

            const retroArchConfigPath = json_config.RETROARCH_CONFIG;

            if (retroArchConfigPath && !(await RNFS.exists(retroArchConfigPath))) {

                const retroConfigText = require("./retroarch.cfg");

                RNFS.writeFile(retroArchConfigPath, retroConfigText, 'utf8')
                    .then(() => {
                        console.log('retroach config created', retroArchConfigPath);
                    })
                    .catch((err) => {
                        console.log("Error to create file", err.message);
                    });

            }
        } catch (err) {
            console.log("error on baseConfig", err.message);
        }


        const file_exists = await RNFS.exists(configFilePath);
        if (file_exists) {

            const content = await RNFS.readFile(configFilePath, 'utf8');

            try {
                const jsonContent = JSON.parse(content)
                return jsonContent;
            } catch (e) {
                console.log("Error reading config file", e)
                return JSON.parse(defaultConfig);
            }
        } else {
            RNFS.writeFile(configFilePath, defaultConfig, 'utf8')
                .then((success) => {
                    console.log('config file created!');
                })
                .catch((err) => {
                    console.log("Error to create file", err.message);
                });
            return JSON.parse(defaultConfig);
        }

    }


    // 
    const dirConfig = async () => {

        const configFilePath = RNFS.DocumentDirectoryPath + "/config.json";

        const defaultConfig = JSON.stringify({
            RETROARCH_CONFIG: RNFS.DocumentDirectoryPath + "/retroarch.cfg",
            RETROARCH_APK_ID: "com.retroarch.ra32",
            BASE_ROOM_DIR: "/storage/external_storage/sda1/batocera/roms",
            CORE_DIR: "/data/data/com.retroarch.ra32/cores", // 
            PLATFORMS: {
                megadrive: {
                    title: "Sega Mega Drive",
                    backgroundImg: "",
                    core: {
                        choices: ["genesis_plus_gx_libretro_android.so"],
                        default: 0
                    },
                    enabled: true,
                },
                atari2600: {
                    title: "Atari 2600",

                    core: {
                        choices: ["stella_libretro_android.so"],
                        default: 0
                    },
                    enabled: true,
                },
                nes: {
                    title: "Nintendinho",

                    core: {
                        choices: [
                            "mesen_libretro_android.so",
                            "fceumm_libretro_android.so"
                        ],
                        default: 1
                    },
                    enabled: true,
                },
                snes: {
                    title: "Super Nintendo",

                    core: {
                        choices: ["snes9x_libretro_android.so"],
                        default: 0
                    },
                    enabled: false,
                },
                n64: {
                    title: "Nintendo 64",

                    core: {
                        choices: [
                            "mupen64plus_next_gles2_libretro_android.so",
                            "mupen64plus_next_gles3_libretro_android.so",
                            "parallel_n64_libretro_android.so"
                        ],
                        default: 1,
                        useMupen: false,
                        useMupenFz: true
                    },
                    
                    enabled: false,
                }
            }
        }, null, 2)

        return await baseConfig(configFilePath, defaultConfig);
    }

    const basename = (path) => {
        return path.substring(path.lastIndexOf('/') + 1)
    }

    const runGame = async ({ rom, platform }) => {

        const _baseConfig = await dirConfig()

        let core;

        const platformCore = _baseConfig?.PLATFORMS[platform]?.core;

        if (platformCore && platformCore?.useMupenFz){

            RunLocalCommand().openMupenPlusFZ(rom);

            return
        }

        if (platformCore && platformCore.choices.length > platformCore.default) {
            core = platformCore.choices[
                platformCore.default
            ]
        }

        const core_path = `${_baseConfig.CORE_DIR}/${core}`

        if (core && await RNFS.exists(rom)) {

            // const COMMAND = `am start --user 0 -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n ${_baseConfig.RETROARCH_APK_ID}/com.retroarch.browser.retroactivity.RetroActivityFuture --es "LIBRETRO" "${core_path}" --es "CONFIGFILE" "${_baseConfig.RETROARCH_CONFIG}" --es "ROM" "${rom}" --es "IME" "com.android.inputmethod.latin/.LatinIME"`;

            RunLocalCommand().runRetroArch(
                _baseConfig.RETROARCH_APK_ID, // com.retroarch.ra32
                core_path, // /data/data/com.retroarch/cores/bla.so
                _baseConfig.RETROARCH_CONFIG, // /storage/sdcard1/retroarch.cfg
                rom // /storage/sdcard1/roms/megadrive/sonic2.zip
            );


            // console.log("COMMAND", COMMAND)

        } else {
            console.log("OUPS", core, rom, core_path)
        }

    }

    const keyMapConfig = async () => {

        const configFilePath = RNFS.DocumentDirectoryPath + "/keymap.json";

        const defaultConfig = JSON.stringify({
            leftKeyCode: [21, 29],
            rightKeyCode: [22, 32],
            upKeyCode: [19, 51],
            downKeyCode: [20, 47],

            P1_COIN: [10], // 7
            P1_START: [9], // 2
            P1_A: [49, 96], // u
            P1_B: [37, 97], // i
            P1_C: [38], // j
            P1_D: [39], // k
            P1_E: [43], // o
            P1_F: [40], // l
            P1_UP: [51], // w
            P1_DOWN: [47], // s
            P1_LEFT: [29], // a
            P1_RIGHT: [32], // d

            P2_COIN: [8], // 1
            P2_START: [11], // 4 - WHAT
            P2_A: [148], // 4 - WHAT
            P2_B: [149], // 5
            P2_C: [145], // 1
            P2_D: [146], // 2
            P2_E: [150], // 6
            P2_F: [147], // 3
            P2_UP: [19], // 
            P2_DOWN: [20],
            P2_LEFT: [21],
            P2_RIGHT: [22]
        })

        return await baseConfig(configFilePath, defaultConfig);
    }



    const loadItemsMenu = async () => {

        const _dirConfig = await dirConfig();

        let defaultConfig = []

        if (_dirConfig?.BASE_ROOM_DIR) {
            const base_dir = _dirConfig.BASE_ROOM_DIR;


            const file_exists = await RNFS.exists(base_dir);
            if (file_exists) {


                const listOfFiles = await RNFS.readDir(base_dir);

                if (listOfFiles.length) {

                    for (let i = 0; i < listOfFiles.length; i++) {
                        const file = listOfFiles[i];


                        if (file.isDirectory() && _dirConfig?.PLATFORMS[file.name]?.enabled) {

                            const title = _dirConfig?.PLATFORMS[file.name]?.title
                            const bg = _dirConfig?.PLATFORMS[file.name]?.backgroundImg

                            if (await RNFS.exists(file.path + "/gamelist.xml")) {


                                defaultConfig.push({
                                    type: "platform",
                                    text: file.name,
                                    title: !!title ? title : file.name.toUpperCase(),
                                    path: file.path,
                                    background: !!bg ? bg : ""
                                })
                            }

                        }

                    }
                }

            }
        }

        defaultConfig.sort((a, b) => a.title > b.title)


        return [
            {
                type: "settings",
                title: "SETTINGS",
                text: "Configure Settings"
            },
            ...defaultConfig
        ]
    }

    return {
        dirConfig,
        keyMapConfig,
        loadItemsMenu,
        runGame,
        updateConfig
    }

}