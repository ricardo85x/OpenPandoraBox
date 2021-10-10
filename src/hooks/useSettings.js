import React from 'react'
import { useEffect, createContext, useContext, useState } from "react"
import { Dimensions } from "react-native"
import chakraColors from "../utils/colors"

import { PandaConfig } from "../utils/PandaConfig"

const SettingsContext = createContext({
    appSettings: {},
    keyMap: {},
    APP_HEIGHT: Dimensions.get('window').height,
    APP_WIDTH: Dimensions.get('window').width,
    updateSettings: () => 1,
    themeColor: chakraColors.orange
})

export function SettingsContextProvider({ children }) {

    const [appSettings, setAppSettings] = useState({})
    const [keyMap, setKeyMap] = useState({})
    const [themeColor, setThemeColor] = useState(chakraColors.orange)

    const [APP_HEIGHT, setAPP_HEIGHT] = useState(Dimensions.get('window').height)
    const [APP_WIDTH, setAPP_WIDTH] = useState(Dimensions.get('window').width)

    const pandaConfig = PandaConfig();

    const updateSettings = async () => {
        setKeyMap(await pandaConfig.keyMapConfig())
        const _dirConfig = await pandaConfig.dirConfig()
        setAppSettings(_dirConfig)

        if(_dirConfig?.THEME?.themeColor){
            if (Object.keys(chakraColors).includes(_dirConfig.THEME.themeColor)){
                setThemeColor(chakraColors[_dirConfig.THEME.themeColor])
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
        themeColor
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettingsContext = () => useContext(SettingsContext)
