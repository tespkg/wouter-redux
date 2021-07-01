# Wouter Redux

[Wouter Redux](https://github.com/tespkg/wouter-redux) puts the location
history into Redux store so that browser location changes only responds to
store changes so that you always get the current location in redux store.

[Wouter](https://github.com/molefrog/wouter) is a minimalistic router for
modern React.

## Why

Browse location represents your application state. E.g. pagination parameters. It's usually a good idea to put the state in the URL so that you it's bookmark-able.

If you use redux and keep E.g. pagination outside of the redux state, you'll soon realise you need to select data base on parameters outside of Redux state. This makes writing the selectors tricky

## Usage

```typescript
import { createWouterHook, reducer as routerReducer } from "wouter-redux";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    ...
    router: routerReducer,
  },
});
const useLocation = createWouterHook(store);
function App() {
  return (
    <Provider store={store}>
      <Router hook={useLocation}>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/count/">
          <Counter />
        </Route>
      </Router>
    </Provider>
  );
}
```

## TODO

- [x] test
- [ ] tag v1
- [ ] handle replace in history
