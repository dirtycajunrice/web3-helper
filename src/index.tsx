import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SnackbarProvider } from "notistack";
import { WagmiConfig } from 'wagmi'
import { Provider } from 'react-redux';
import store from './state/store';
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains, wagmiClient } from "@utils/blockchain";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          appInfo={{ appName: "Web3 Helper" }}
          theme={darkTheme()}
        >
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

