import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';

import AppBar from './components/AppBar'
import AppDrawer from './components/Drawer';

import BatchTransfer from './pages/batchTransfer';
import TokenImport from "@pages/TokenImport";
import SignMessage from './pages/signMessage';
import ERC1155Transfer from '@pages/ERC1155Transfer';
import TokenPermit from '@pages/TokenPermit';

import './App.css';

function App() {

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
      <BrowserRouter>
        <AppBar />
        <AppDrawer />
        <Box
          sx={{
            width: {
              xs: 0.95,
              sm: 0.8
            },
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Routes>
            <Route path="/" element={<TokenImport />} />
            <Route path="/erc1155-transfer" element={<ERC1155Transfer />} />
            <Route path="/batch-transfer" element={<BatchTransfer />} />
            <Route path="/sign-message" element={<SignMessage />} />
            <Route path="/token-permit" element={<TokenPermit />} />
            <Route path="/*" element={<Navigate replace to="/" />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  );
}

export default App;
