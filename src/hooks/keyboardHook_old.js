import React from 'react'
import { createContext, useContext, useState, useRef } from "react"

const KeyboardContext = createContext({
    searchText: "",
    setSearchText: (text) => { console.log("setSearchText NOT initialized ", text)},
    keyboardActive: false,
    setKeyboardActive: (active) => {console.log("setKeyboardActive NOT initialized ", active)},
    keyboardActiveRef: undefined,
    keyBoardHeight: 50,
    setKeyBoardHeight: (height) => {console.log("setKeyBoardHeight NOT initialized ", height)},
})

export function KeyboardContextProvider({ children }) {

    const [searchText, setSearchText] = useState("")
    const [keyboardActive, setKeyboardActive] = useState(false)
    const [keyBoardHeight, setKeyBoardHeight] = useState(50)


    const keyboardActiveRef = useRef(keyboardActive)


    // const [, forceUpdateKeyboard] = useReducer(x => x + 1, 0);



    const value = {
        searchText,
        setSearchText,
        keyboardActive,
        setKeyboardActive,
        keyboardActiveRef,
        keyBoardHeight,
        setKeyBoardHeight
        // keyboardData, setKeyboardData, forceUpdateKeyboard
    }

    return (
        <KeyboardContext.Provider value={value}>
            {children}
        </KeyboardContext.Provider>
    )
}

export const useKeyboardContext = () => useContext(KeyboardContext)
