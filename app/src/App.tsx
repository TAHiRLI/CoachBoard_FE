import "./App.css";
import "../i18n";

import { ColorModeProvider } from "./context/colorMode.context";
import { KeycloakProvider } from "./context/KeycloakProvider";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { persistor } from "./store/store";
import { router } from "./router/router";
import store from "./store/store";

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
          <KeycloakProvider>
            <RouterProvider router={router} />
          </KeycloakProvider>
        </ColorModeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
