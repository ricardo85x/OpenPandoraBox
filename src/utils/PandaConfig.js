import RNFS from "react-native-fs"
import { RunLocalCommand } from "../modules/RunLocalCommand";

export const PandaConfig = () => {

    const updateConfig = async (newConfig) => {

        const configFilePath = RNFS.DocumentDirectoryPath + "/config.json";
        const currentConfig = await dirConfig();

        const updatedConfig = { ...currentConfig, ...newConfig}

        let updated = false;
        Object.keys(currentConfig).forEach(key => {
            if (updatedConfig[key] !== currentConfig[key]) {
                updated = true
            }
        })

        console.log("Le updated", updatedConfig)

        if(updated) {
            const updatedConfigText = JSON.stringify(updatedConfig, null, 2);

            await Promise.all(RNFS.writeFile(configFilePath, updatedConfigText, 'utf8')
                .then(() => {
                    console.log('Settings updated successfully', configFilePath);
                })
                .catch((err) => {
                    console.log("Error on update settings", err.message);
                })
            );
    
            return true;
        } else {
            return false
        }
 

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
            RETROARCH_CONFIG: "/storage/emulated/legacy/Android/data/com.retroarch.ra32/files/retroarch.cfg",
            RETROARCH_APK_ID: "com.retroarch.ra32",
            BASE_ROOM_DIR: "/storage",
            CORE_DIR: "/data/data/com.retroarch.ra32/cores", // 
            THEME: {
                settingsBackgroundImg:"",
                historyBackgroundImg:""
            },
            PLATFORMS: {}
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

        const launcher = _baseConfig?.PLATFORMS[platform]?.launcher ? _baseConfig?.PLATFORMS[platform].launcher : "retroarch"

        if (launcher == "MupenFz"){
            RunLocalCommand().openMupenPlusFZ(rom);
            return
        }

        if (launcher == "PPSSPP"){
            RunLocalCommand().openPPSSPP(rom);
            return
        }


        if (launcher == "Drastic"){
            RunLocalCommand().openDrastic(rom);
            return
        }

        if (launcher == "Reicast"){
            RunLocalCommand().openReicast(rom);
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


    const listCores = async () => {

        let cores = []
        const _dirConfig = await dirConfig();

        if( _dirConfig?.CORE_DIR){

            const core_path_exists = await RNFS.exists( _dirConfig.CORE_DIR);

            if( core_path_exists){
                const listOfFiles = await RNFS.readDir(_dirConfig.CORE_DIR);

                if (listOfFiles.length) {

                    for (let i = 0; i < listOfFiles.length; i++) {
                        const file = listOfFiles[i];


                        if (file.isFile()  ) {

                            if(file.name.match(/[^.].+\.so/)){
                                cores.push(file.name)
                            }

                        }
                    }
                }
            }



        }



        return cores;
    }


    const listPlatforms = async () => {

        const _dirConfig = await dirConfig();

        let platforms = []

        if (_dirConfig?.BASE_ROOM_DIR) {
            const base_dir = _dirConfig.BASE_ROOM_DIR;


            const file_exists = await RNFS.exists(base_dir);
            if (file_exists) {

                const listOfFiles = await RNFS.readDir(base_dir);

                if (listOfFiles.length) {

                    for (let i = 0; i < listOfFiles.length; i++) {
                        const file = listOfFiles[i];


                        if (file.isDirectory()  ) {


                            const enabled = _dirConfig?.PLATFORMS[file.name]?.enabled

                            const title = _dirConfig?.PLATFORMS[file.name]?.title
                            const bg = _dirConfig?.PLATFORMS[file.name]?.backgroundImg
                            const core = _dirConfig?.PLATFORMS[file.name]?.core;

                            const selected_core = (
                                !! core && 
                                core?.choices.length &&
                                core?.default >= 0 &&
                                core.choices.length > core.default
                            ) ? core.choices[core.default] : ""

                            const launcher = _dirConfig?.PLATFORMS[file.name]?.launcher;

                            if (await RNFS.exists(file.path + "/gamelist.xml")) {
                                platforms.push({
                                    name: title,
                                    dir: file.name,
                                    enabled: enabled ? true : false,
                                    background: !!bg ? bg : "",
                                    core: selected_core,
                                    launcher: launcher ? launcher : "retroarch"
                                })
                            }
                        }
                    }
                }
            }
        }

        platforms.sort((a, b) => a.dir > b.dir)


        return platforms.map((e,i) => {
            return {...e,key:i }
        });


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
            {
                type: "history",
                title: "HISTORY",
                text: "Past played games"
            },
            ...defaultConfig
        ]
    }

    return {
        dirConfig,
        keyMapConfig,
        loadItemsMenu,
        runGame,
        updateConfig,
        listPlatforms,
        listCores
    }

}