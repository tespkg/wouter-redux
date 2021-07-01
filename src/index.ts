import { AnyAction, Reducer, Store } from 'redux'
import { createUseLocation } from './use-location'

export const UPDATE_LOCATION = '@router/updateLocation'

export type WouterLocation = {
  path: string
  search: string
}

export type WouterAction = {
  type: typeof UPDATE_LOCATION
  payload: WouterLocation
}

export type WouterState = {
  location: WouterLocation
  history: WouterLocation[]
}

export const createWouterHook = <S extends Store>(store: S) => {
  const dispatchLocationUpdate = (location: WouterLocation) => {
    store.dispatch({
      type: UPDATE_LOCATION,
      payload: location,
    })
  }
  return createUseLocation(dispatchLocationUpdate)
}

const initialState: WouterState = {
  location: { path: '', search: null },
  history: [],
}

export const reducer: Reducer = (
  state: WouterState = initialState,
  action: WouterAction & AnyAction,
) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      if (
        state.location.path !== action.payload.path ||
        state.location.search !== action.payload.search
      ) {
        const location = action.payload
        const history = [location, ...state.history]
        if (history.length > 20) {
          history.splice(20)
        }
        return { location, history }
      }
  }
  return state
}
