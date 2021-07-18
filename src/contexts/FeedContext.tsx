import React, { createContext, useEffect, useReducer } from 'react'

type Action = 
| { type: 'UPDATE_IMAGE_LIST', payload: API.Feed.FeedItem[] }
| { type: 'UPDATE_LOADING_STATE', payload: boolean }

type FeedContextType = {
  images: API.Feed.FeedItem[];
  loading: boolean;
}

const initialState: FeedContextType = {
  images: [],
  loading: false
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

    case 'UPDATE_LOADING_STATE':
      return {
        ...state,
        loading: action.payload
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

  useEffect(() => {
    dispatcher({ type: 'UPDATE_LOADING_STATE', payload: value.loading })
  }, [value.loading, dispatcher])

  return (
    <FeedContext.Provider value={reducerHook}>
      { children }
    </FeedContext.Provider>
  )
}

export { FeedContext }

export default FeedContextProvider