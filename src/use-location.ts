// forked from https://github.com/molefrog/wouter/blob/master/use-location.js
// this effectively just added 2 lines:
//
// export const createUseLocation =
//   (dispatch: DispatchLocationUpdate): BaseLocationHook =>
//
// To replace:
//
// export default ({ base = '' } = {}) => {
//
// and inserted after update({ path: pathname, search })
//
// dispatch({ path: pathname, search })
//
// and also added initial mount dispatch

import { useCallback, useEffect, useRef, useState } from 'react'
import { BaseLocationHook } from 'wouter'

/**
 * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
 */
const eventPopstate = 'popstate'
const eventPushState = 'pushState'
const eventReplaceState = 'replaceState'
export const events = [eventPopstate, eventPushState, eventReplaceState]

type Location = { path: string; search: string }

export type DispatchLocationUpdate = (location: Location) => void

export const createUseLocation =  // ADDED this line and next line
  (dispatch: DispatchLocationUpdate): BaseLocationHook =>
  ({ base = '' } = {}) => {
    const [{ path, search }, update] = useState(() => ({
      path: currentPathname(base),
      search: location.search,
    })) // @see https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    const prevHash = useRef(path + search)

    useEffect(() => {
      // this function checks if the location has been changed since the
      // last render and updates the state only when needed.
      // unfortunately, we can't rely on `path` value here, since it can be stale,
      // that's why we store the last pathname in a ref.
      const checkForUpdates = () => {
        const pathname = currentPathname(base)
        const search = location.search
        const hash = pathname + search

        if (prevHash.current !== hash) {
          prevHash.current = hash
          update({ path: pathname, search })
          dispatch({ path: pathname, search }) // ADDED
        }
      }

      events.forEach((e) => addEventListener(e, checkForUpdates))

      // it's possible that an update has occurred between render and the effect handler,
      // so we run additional check on mount to catch these updates. Based on:
      // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
      checkForUpdates()

      // dispatch current location on mount
      dispatch({ path, search }) // ADDED

      return () => events.forEach((e) => removeEventListener(e, checkForUpdates))
    }, [base])

    // the 2nd argument of the `useLocation` return value is a function
    // that allows to perform a navigation.
    //
    // the function reference should stay the same between re-renders, so that
    // it can be passed down as an element prop without any performance concerns.
    const navigate = useCallback(
      (to, { replace = false } = {}) =>
        history[replace ? eventReplaceState : eventPushState](
          null,
          '',
          // handle nested routers and absolute paths
          to[0] === '~' ? to.slice(1) : base + to,
        ),
      [base],
    )

    return [path, navigate]
  }

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
if (typeof history !== 'undefined') {
  for (const type of [eventPushState, eventReplaceState]) {
    const original = history[type]

    history[type] = function () {
      const result = original.apply(this, arguments)
      const event = new Event(type)

      ;(event as any).arguments = arguments

      dispatchEvent(event)
      return result
    }
  }
}

const currentPathname = (base: string, path = location.pathname) =>
  !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || '/' : '~' + path
