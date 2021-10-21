export type IAppColor = "white"|"yellow"|"green"|"red"|"blue"|"pink"|"orange"
export type IAppLauchers = "retroarch"|"Drastic"|"MupenFz"|"openBor"|"openBor old"|"PPSSPP"|"Reicast"

interface IThemeSettings {
    settingsBackgroundImg:string,
    historyBackgroundImg:string,
    searchBackgroundImg:string,
    colorButton_A: IAppColor,
    colorButton_B: IAppColor,
    colorButton_C: IAppColor,
    colorButton_D: IAppColor,
    colorButton_E: IAppColor,
    colorButton_F: IAppColor, 
    themeColor: IAppColor
}

export interface IAppSettings {
    RETROARCH_CONFIG: string,
    RETROARCH_APK_ID: string,
    BASE_ROOM_DIR: string,
    CORE_DIR: string,
    THEME: IThemeSettings,
    PLATFORMS: {
        [key:string]: {
            title: string,                                                           
            backgroundImg: string,                                                             
            core: {                                                                        
              choices: string[],                                                                             
              default: number                                                                   
            },                                                                               
            enabled: boolean,                                                                
            launcher: IAppLauchers
        }
    } 
}




