import './App.css'
import "../i18n"
import { ColorModeProvider } from './context/colorMode.context';
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/store';
import store from './store/store';
import { router } from './router/router';

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ColorModeProvider>
          <RouterProvider router={router} />
        </ColorModeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
