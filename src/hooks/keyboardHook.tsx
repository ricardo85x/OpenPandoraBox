import React, { ReactNode } from 'react'
import { MutableRefObject } from 'react'
import { createContext, useContext, useState, useRef } from "react"

interface KeyboardContextProviderProps {
    children: ReactNode
}


interface KeyboardContextValuesProps {
    searchText: string
    setSearchText: (text: string) => void
    keyboardActive: boolean
    setKeyboardActive: (active: boolean) => void
    keyboardActiveRef: MutableRefObject<boolean> | undefined
    keyBoardHeight: number
    setKeyBoardHeight: (height: number) => void

}
const KeyboardContext = createContext<KeyboardContextValuesProps>({
    searchText: "",
    setSearchText: (text: string) => { console.log("setSearchText NOT initialized ", text)},
    keyboardActive: false,
    setKeyboardActive: (active: boolean) => { console.log("setKeyboardActive NOT initialized ", active)},
    keyboardActiveRef: undefined,
    keyBoardHeight: 50,
    setKeyBoardHeight: (height: number) => { console.log("setKeyBoardHeight NOT initialized ", height)},
})

export function KeyboardContextProvider({ children }: KeyboardContextProviderProps) {

    const [searchText, setSearchText] = useState("")
    const [keyboardActive, setKeyboardActive] = useState(false)
    const [keyBoardHeight, setKeyBoardHeight] = useState(50)

    const keyboardActiveRef = useRef(keyboardActive)

    const value : KeyboardContextValuesProps = {
        searchText,
        setSearchText,
        keyboardActive,
        setKeyboardActive,
        keyboardActiveRef,
        keyBoardHeight,
        setKeyBoardHeight
    }

    return (
        <KeyboardContext.Provider value={value}>
            {children}
        </KeyboardContext.Provider>
    )
}

export const useKeyboardContext = () => useContext(KeyboardContext)
