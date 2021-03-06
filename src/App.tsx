import { ethers } from 'ethers';
import React, { useState } from 'react';

import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import './App.css';
import BatchTransfer from './pages/batchTransfer';
import Main from "./pages/main";
import SynapsePending from "./pages/synapsePending";
import EternalPages from './pages/eternalPages';
import AppBar from './components/AppBar'
import AppDrawer from './components/Drawer';

import { Box } from '@mui/material';


function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [account, setAccount] = useState<string>("")
  const [currentChain, setCurrentChain] = useState<number>()
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  return (
    <Box
      id="App"
      sx={{
        textAlign: 'center',
        backgroundColor: '#282c34',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white',
    }}
    >
      <HashRouter>
        <AppBar
          provider={provider}
          setProvider={setProvider}
          account={account}
          setAccount={setAccount}
          currentChain={currentChain}
          setCurrentChain={setCurrentChain}
          setDrawerOpen={setDrawerOpen}
        />
        <AppDrawer open={drawerOpen} setOpen={setDrawerOpen} />
        <Routes>
          <Route path="/" element={<Main provider={provider} account={account} currentChain={currentChain} />} />
          <Route path="/synapse" element={<SynapsePending />} />
          <Route path="/eternal-pages" element={<EternalPages provider={provider} account={account} />} />
          <Route path="/batch-transfer" element={<BatchTransfer provider={provider} account={account} />} />
          <Route path="/*" element={<Navigate replace to="/" />} />
        </Routes>
      </HashRouter>
    </Box>
  );
}

export default App;
