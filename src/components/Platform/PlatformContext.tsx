import React, { ReactNode, useMemo } from 'react'
import { createContext, useContext, useState } from "react"

type FooterItemType = {
    color: string, 
    title: string, 
    text: string
}
interface PlatformContextPropsValue {
    footerItems: Array<FooterItemType>,
    title: string,
    setTitle: (value: string) => void
}

const PlatformContext = createContext<PlatformContextPropsValue>({
    footerItems: [],
} as any as PlatformContextPropsValue)

interface PlatformContextProviderProps {
    children: ReactNode
}

export function PlatformContextProvider({ children }: PlatformContextProviderProps) {

    const [title, setTitle] = useState("")

    const footerItems = useMemo(() => {

        if(title === "All") {
            return [
                {color: "white", title: "A", text: "SELECT"},
                {color: "yellow", title: "B", text: "BACK"},
                {color: "pink", title: "D", text: "RELOAD"},
                {color: "green", title: "F", text: "FAV."}
            ]
        } else {
            return [
                {color: "white", title: "A", text: "SELECT"},
                {color: "yellow", title: "B", text: "BACK"},
                {color: "pink", title: "D", text: "RELOAD"},
                {color: "blue", title: "E", text: "RANDOM"},
                {color: "green", title: "F", text: "FAV."}
            ]
        }

    }, [title])


    const value = {
        footerItems, title, setTitle
    }

    

    return (
        <PlatformContext.Provider value={value}>
            {children}
        </PlatformContext.Provider>
    )
}

export const usePlatformContext = () => useContext(PlatformContext)
