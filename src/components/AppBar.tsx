import LoadingButton from '@mui/lab/LoadingButton';
import { useAppDispatch } from '@state/hooks';
import { setUiComponent } from '@state/ui/reducer';
import { Component } from '@state/ui/types';
import React, { useEffect, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  SvgIcon,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { ReactComponent as MetamaskSVG } from '../assets/images/metamask-logo.svg';
import { useConnectModal, useAccount, useSigner } from '@web3modal/react';

const TopAppBar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [wbLoad, setWbLoad] = useState<boolean>(false)
  const { open } = useConnectModal();
  const { address, connector } = useAccount();
  const { refetch, isLoading, error, signer } = useSigner();

  useEffect(() => {
    if (address && !connector) {
      console.log(address, connector, error, signer)
    }
  }, [error, connector, address, isLoading, signer])

  const short = (a: string): string => a.slice(0, 4) + "..." + a.slice(a.length - 4, a.length);
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
        <Toolbar >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => dispatch(setUiComponent(Component.NavDrawer))}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {PageName()}
          </Typography>
          <LoadingButton
            loading={wbLoad}
            loadingPosition="start"
            variant="contained"
            startIcon={<SvgIcon component={MetamaskSVG} inheritViewBox />}
            onClick={open}
            sx={{ textTransform: "none"}}
          >
            {address ? short(address) : "Connect Wallet"}
          </LoadingButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopAppBar