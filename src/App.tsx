import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import './App.css';
import BatchTransfer from './pages/batchTransfer';
import TokenImport from "@pages/TokenImport";
import SignMessage from './pages/signMessage';
import ERC1155Transfer from '@pages/ERC1155Transfer';
import AppBar from './components/AppBar'
import AppDrawer from './components/Drawer';

import { Box } from '@mui/material';


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
        <Routes>
          <Route path="/" element={<TokenImport />} />
          <Route path="/erc1155-transfer" element={<ERC1155Transfer />} />
          <Route path="/batch-transfer" element={<BatchTransfer />} />
          <Route path="/sign-message" element={<SignMessage />} />
          <Route path="/*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
