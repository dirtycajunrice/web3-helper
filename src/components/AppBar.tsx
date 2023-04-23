
import "@rainbow-me/rainbowkit/styles.css";
import { useAppDispatch } from '@state/hooks';
import { setUiComponent } from '@state/ui/reducer';
import { Component } from '@state/ui/types';
import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, CssBaseline } from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { ConnectButton } from "@rainbow-me/rainbowkit";

const TopAppBar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const PageName = () => {
    switch (location.pathname) {
      case '/batch-transfer':
        return "NFT Batch Transfer"
      case '/synapse':
        return "Synapse Pending Browser"
      case '/erc1155-transfer':
        return "ERC1155 Transfer"
      default:
        return "DirtyCajunRice's Web3 Helper"
    }
  }

  return (
    <Box sx={{ width: 0.8, marginTop: 2 }}>
      <AppBar color='default' sx={{ colorDefault: 'white' }}>
        <Toolbar sx={{ position: 'relative' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ position: 'absolute', left: '16px' }}
            onClick={() => dispatch(setUiComponent(Component.NavDrawer))}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ position: 'absolute', left: 50, right: 50 }}>
            {PageName()}
          </Typography>

          <Box sx={{ position: 'absolute', right: '16px' }}>
            <Box sx={{ display: 'flex', fontSize: '20px !important' }}>
              <ConnectButton />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopAppBar