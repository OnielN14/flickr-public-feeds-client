import React, { createContext, useEffect, useReducer } from 'react'
import { FeedResultResponse } from '../helpers/API'

type Action = 
| { type: 'UPDATE_IMAGE_DATA', payload: FeedResultResponse }
| { type: 'UPDATE_LOADING_STATE', payload: boolean }
| { type: 'UPDATE_ID', payload: string }

type FeedContextType = {
  data: FeedResultResponse;
  loading: boolean;
  id: string;
}

const initialState: FeedContextType = {
  data: {
    data: [],
    page: 0,
    perPage: 0,
    total: 0,
    totalPage: 0
  },
  loading: false,
  id: ''
}

const FeedContext = createContext<[ FeedContextType, (action:Action) => any ]>([
  initialState, (action: Action) => {}
])

const reducer: React.Reducer<FeedContextType, Action> = (state, action) => {
  switch (action.type) {
    case 'UPDATE_IMAGE_DATA':
      return {
        ...state,
        data: {...action.payload}
      }

    case 'UPDATE_LOADING_STATE':
      return {
        ...state,
        loading: action.payload
      }

    case 'UPDATE_ID':
      return {
        ...state,
        id: action.payload
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
    dispatcher({ type: 'UPDATE_IMAGE_DATA', payload: value.data })
  }, [value.data, dispatcher])

  useEffect(() => {
    dispatcher({ type: 'UPDATE_LOADING_STATE', payload: value.loading })
  }, [value.loading, dispatcher])

  useEffect(() => {
    dispatcher({ type: 'UPDATE_ID', payload: value.id })
  }, [value.id, dispatcher])

  return (
    <FeedContext.Provider value={reducerHook}>
      { children }
    </FeedContext.Provider>
  )
}

export { FeedContext }

export default FeedContextProvider