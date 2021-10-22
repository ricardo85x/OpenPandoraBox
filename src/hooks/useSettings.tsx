import React, { ReactNode } from 'react';
import { useEffect, createContext, useContext, useState } from "react"
import { Dimensions } from "react-native"
import chakraColors from "../utils/constants/colors"

import { PandaConfig } from "../utils/PandaConfig"
import { IAppSettings, IKeyMap } from '../utils/types';

const SettingsContext = createContext({
    appSettings: {} as IAppSettings,
    keyMap: {} as IKeyMap,
    APP_HEIGHT: Dimensions.get('window').height,
    APP_WIDTH: Dimensions.get('window').width,
    updateSettings: async () => console.log(),
    themeColor: chakraColors.orange,
    chakraColors: chakraColors
})

interface SettingsContextProviderProps {
    children: ReactNode
}

export function SettingsContextProvider({ children }: SettingsContextProviderProps) {
    
    const [appSettings, setAppSettings] = useState<IAppSettings>({} as IAppSettings)
    const [keyMap, setKeyMap] = useState<IKeyMap>({} as IKeyMap)
    const [themeColor, setThemeColor] = useState(chakraColors.orange)

    const APP_HEIGHT = Dimensions.get('window').height
    const APP_WIDTH = Dimensions.get('window').width

    const pandaConfig = PandaConfig();

    const updateSettings = async () => {
        setKeyMap(await pandaConfig.keyMapConfig())
        const _dirConfig = await pandaConfig.dirConfig()
        setAppSettings(_dirConfig)

        if(_dirConfig?.THEME?.themeColor){
            const _themeColor = _dirConfig?.THEME?.themeColor ?? "orange"
            if (Object.keys(chakraColors).includes(_themeColor)){
                setThemeColor(chakraColors[_themeColor])
            }
        }
    }

    useEffect(() => {
        updateSettings()

    }, [])

    const value = {
        appSettings,
        keyMap,
        APP_HEIGHT,
        APP_WIDTH,
        updateSettings,
        themeColor,
        chakraColors
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettingsContext = () => useContext(SettingsContext)
