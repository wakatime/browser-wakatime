import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { RootState } from '../stores/createStore';

// As a basic setup, import your same slice reducers
import userReducer, { initialState as InitalCurrentUser } from '../reducers/currentUser';
import configReducer, { initialConfigState } from '../reducers/configReducer';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
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
): any {
  function Wrapper({ children }: PropsWithChildren<Record<string, unknown>>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
