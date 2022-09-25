import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from "notistack";
import { WagmiConfig } from 'wagmi'
import { Provider } from 'react-redux';
import { ConnectKitProvider } from "connectkit";
import store from './state/store';
import client from "@services/wagmi";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiConfig client={client}>
        <ConnectKitProvider mode="dark" options={{ walletConnectName: "WalletConnect" }}>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
