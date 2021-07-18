import React, { createContext, useEffect, useReducer } from 'react'
import { FeedItemType } from '../components/FeedItem'

type Action = 
| { type: 'UPDATE_IMAGE_LIST', payload: FeedItemType[] }

type FeedContextType = {
  images: FeedItemType[]
}

const initialState: FeedContextType = {
  images: []
}

const FeedContext = createContext<[ FeedContextType, (action:Action) => any ]>([
  initialState, (action: Action) => {}
])

const reducer: React.Reducer<FeedContextType, Action> = (state, action) => {
  switch (action.type) {
    case 'UPDATE_IMAGE_LIST':
      return {
        ...state,
        images: [...action.payload]
      }
  
    default:
      return state
  }
}

type FeedContextProviderProps = {
  value: FeedContextType
}
const FeedContextProvider: React.FC<FeedContextProviderProps> = ({ children, value }) => {
  const reducerHook = useReducer(reducer, {
    ...initialState,
    ...value
  })

  const [_, dispatcher] = reducerHook

  useEffect(() => {
    dispatcher({ type: 'UPDATE_IMAGE_LIST', payload: value.images })
  }, [value.images, dispatcher])

  return (
    <FeedContext.Provider value={reducerHook}>
      { children }
    </FeedContext.Provider>
  )
}

export { FeedContext }

export default FeedContextProvider