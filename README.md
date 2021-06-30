# Wouter Redux

[Wouter](https://github.com/molefrog/wouter) is a minimalistic router for modern React.

Wouter Redux puts the location history into Redux store so that browser
location changes only responds to store changes so that you always get the
current location in redux store.

## Why

Browse location represents your application state. E.g. pagination parameters. It's usually a good idea to put the state in the URL so that you it's bookmark-able.

If you use redux and keep E.g. pagination outside of the redux state, you'll soon realise you need to select data base on parameters outside of Redux state. This makes writing the selectors tricky

## Usage

TODO
