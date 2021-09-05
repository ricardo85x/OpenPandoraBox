import React from 'react'
import { useEffect, createContext, useContext, useState } from "react"
import SQLiteManager from '../utils/db/SQLiteManager';

const DbContext = createContext({})

export function DbContextProvider({ children }) {

    const [db, setDb] = useState()

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
