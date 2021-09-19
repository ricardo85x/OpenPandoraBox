import React from 'react'
import { useEffect, createContext, useContext, useState } from "react"
import { Dimensions } from "react-native"


import { PandaConfig } from "../utils/PandaConfig"

const SettingsContext = createContext({
    appSettings: {},
    keyMap: {},
    APP_HEIGHT: Dimensions.get('window').height,
    APP_WIDTH: Dimensions.get('window').width,
    updateSettings: () => 1
})

export function SettingsContextProvider({ children }) {

    const [appSettings, setAppSettings] = useState({})
    const [keyMap, setKeyMap] = useState({})

    const [APP_HEIGHT, setAPP_HEIGHT] = useState(Dimensions.get('window').height)
    const [APP_WIDTH, setAPP_WIDTH] = useState(Dimensions.get('window').width)

    const pandaConfig = PandaConfig();

    const updateSettings = async () => {
        setKeyMap(await pandaConfig.keyMapConfig())
        setAppSettings(await pandaConfig.dirConfig())
    }

    useEffect(() => {
        updateSettings()

    }, [])

    const value = {
        appSettings,
        keyMap,
        APP_HEIGHT,
        APP_WIDTH,
        updateSettings
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettingsContext = () => useContext(SettingsContext)
