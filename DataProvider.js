import React, { useState, useEffect, createContext } from 'react'
import UserAPI from './api/UserAPI'
import BlogAPI from './api/BlogAPI'

export const GlobalState  = createContext()

const DataProvider = ({children}) => {
  const state= {
    UserAPI: UserAPI(),
    BlogAPI: BlogAPI()
  }

  return (
    <GlobalState.Provider value={state}>
      {children}
    </GlobalState.Provider>
  )
}

export default DataProvider