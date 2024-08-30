import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { RootState } from '../stores/createStore';

// As a basic setup, import your same slice reducers
import configReducer, { initialConfigState } from '../reducers/configReducer';
import userReducer, { initialState as InitalCurrentUser } from '../reducers/currentUser';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  // TODO: Fix Type as `PreloadedState` is not exported in the latest version of `@redux/toolkit`
  // preloadedState?: PreloadedState<RootState>;
  preloadedState?: object;
  store?: Store<RootState>;
}

const rootReducer = combineReducers({
  config: configReducer,
  currentUser: userReducer,
});

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      config: initialConfigState,
      currentUser: InitalCurrentUser,
    },
    // Automatically create a store instance if no store was passed in
    store = configureStore({ preloadedState, reducer: rootReducer }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  function Wrapper({ children }: PropsWithChildren<Record<string, unknown>>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
