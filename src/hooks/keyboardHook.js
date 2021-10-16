import React from 'react'
import { createContext, useContext, useState, useRef } from "react"

const KeyboardContext = createContext({
    searchText: "",
    setSearchText: (text) => { console.log("setSearchText NOT initialized ", text)},
    keyboardActive: false,
    setKeyboardActive: (active) => {console.log("setKeyboardActive NOT initialized ", active)},
    keyboardActiveRef: undefined
})

export function KeyboardContextProvider({ children }) {

    const [searchText, setSearchText] = useState("")
    const [keyboardActive, setKeyboardActive] = useState(false)

    const keyboardActiveRef = useRef(keyboardActive)

    // const [, forceUpdateKeyboard] = useReducer(x => x + 1, 0);



    const value = {
        searchText,
        setSearchText,
        keyboardActive,
        setKeyboardActive,
        keyboardActiveRef
        // keyboardData, setKeyboardData, forceUpdateKeyboard
    }

    return (
        <KeyboardContext.Provider value={value}>
            {children}
        </KeyboardContext.Provider>
    )
}

export const useKeyboardContext = () => useContext(KeyboardContext)
