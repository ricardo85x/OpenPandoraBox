import React, { ReactNode } from 'react'
import { useEffect, createContext, useContext, useState } from "react"
import SQLiteManager from '../utils/db/SQLiteManager';


interface DbContextPropsValue {
    db: typeof SQLiteManager | null
}
const DbContext = createContext<DbContextPropsValue>({
    db: null  
})

interface DbContextProviderProps {
    children: ReactNode
}

export function DbContextProvider({ children }: DbContextProviderProps) {

    const [db, setDb] = useState(SQLiteManager)

    useEffect(() => {
        
        SQLiteManager.initDB();
        setDb(SQLiteManager);

        return () => SQLiteManager.closeDatabase(SQLiteManager.db)

    }, [])

    const value = {
        db
    }

    return (
        <DbContext.Provider value={value}>
            {children}
        </DbContext.Provider>
    )
}

export const useDbContext = () => useContext(DbContext)
