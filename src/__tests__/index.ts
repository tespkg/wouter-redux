import { act, renderHook } from '@testing-library/react-hooks'
import { createStore } from 'redux'
import { createWouterHook, reducer } from '../index'

test('index', () => {
  const store = createStore(reducer)

  const hook = createWouterHook(store)

  const { result } = renderHook(() => hook())
  expect(result.current.length).toBe(2)
  expect(result.current[0]).toBe('/')
  expect(typeof result.current[1]).toBe('function')

  let state = store.getState()
  expect(state.location).toEqual({ path: '/', search: '' })
  expect(state.history).toEqual([{ path: '/', search: '' }])

  act(() => {
    result.current[1]('foo')
  })
  expect(result.current[0]).toBe('/foo')
  expect(typeof result.current[1]).toBe('function')

  state = store.getState()
  expect(state.location).toEqual({ path: '/foo', search: '' })
  expect(state.history).toEqual([
    { path: '/foo', search: '' },
    { path: '/', search: '' },
  ])

  act(() => {
    result.current[1]('/bar/', { replace: true })
  })
  expect(result.current[0]).toBe('/bar/')
  expect(typeof result.current[1]).toBe('function')
  state = store.getState()
  expect(state.location).toEqual({ path: '/bar/', search: '' })
  expect(state.history).toEqual([
    { path: '/bar/', search: '' },
    { path: '/foo', search: '' },
    { path: '/', search: '' },
  ])

  act(() => {
    history.pushState(null, 'random thing', '/pushed')
  })
  expect(result.current[0]).toBe('/pushed')
  expect(store.getState().location).toEqual({ path: '/pushed', search: '' })

  act(() => {
    history.replaceState(null, 'hello', 'replaced?123')
  })
  expect(result.current[0]).toBe('/replaced')
  expect(store.getState().location).toEqual({ path: '/replaced', search: '?123' })
})
