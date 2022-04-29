import LoadingButton from '@mui/lab/LoadingButton';
import { ethers, providers } from 'ethers';
import { useSnackbar } from 'notistack';
import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton, SvgIcon,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { ReactComponent as MetamaskSVG } from '../assets/images/metamask-logo.svg';

interface TopAppBarProps {
  provider?: providers.Web3Provider
  setProvider: (provider: providers.Web3Provider) => void
  account?: string
  setAccount: (account: string) => void
  currentChain?: number
  setCurrentChain: (chain: number) => void
  setDrawerOpen: (open: boolean) => void
}
const TopAppBar: FC<TopAppBarProps> = (
  {
    provider,
    setProvider,
    account,
    setAccount,
    currentChain,
    setCurrentChain,
    setDrawerOpen
  }
) => {
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar();

  const [wbLoad, setWbLoad] = useState<boolean>(false)

  const Success = (message: string) => enqueueSnackbar(message, {variant: "success"})
  const Error = (message: string) => enqueueSnackbar(message, {variant: "error"})

  const short = (a: string): string => a.slice(0, 4) + "..." + a.slice(a.length - 4, a.length);
  const PageName = () => {
    switch (location.pathname) {
      case '/batch-transfer':
        return "NFT Batch Transfer"
      case '/synapse':
        return "Synapse Pending Browser"
      case '/eternal-pages':
        return "Eternal Story Pages Transfer"
      default:
        return "DirtyCajunRice's Web3 Helper"
    }
  }

  const connectWallet = async () => {
    let ethereum = (window as any).ethereum
    if (!ethereum) return
    const p = new ethers.providers.Web3Provider(ethereum)
    if (!provider) setProvider(p)
    setWbLoad(true)
    try {
      await p.send("eth_requestAccounts", []);
      const accounts = await p.listAccounts()
      if (accounts.length > 0) {
        setAccount(accounts[0])
        const network = await p.getNetwork()
        setCurrentChain(network.chainId)
        Success("Connected!")
        ethereum.on('accountsChanged', (a: string[]) => {
          if (a.length === 0) setAccount("")
          else setAccount(a[0])
        });
        ethereum.on('chainChanged', (chainId: string) => {
          setCurrentChain(parseInt(chainId, 16))

        });
      }
      setWbLoad(false)
    } catch (e) {
      // @ts-ignore
      Error(e.message)
      setWbLoad(false)
    }

  }

  useEffect(() => {
    if (provider) return;
    let ethereum = (window as any).ethereum
    if (!ethereum) return
    const p = new ethers.providers.Web3Provider(ethereum)
    setProvider(p)
    const checkConnected = async () => {
      setWbLoad(true)
      const accounts = await p.listAccounts()
      setAccount(accounts[0])
      if (accounts.length > 0) {
        setWbLoad(false)
        await connectWallet()
      }
      setWbLoad(false)
    }
    checkConnected()
  }, [provider, setAccount, setProvider])

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
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {PageName()}
          </Typography>
          <LoadingButton
            loading={wbLoad}
            disabled={!!account}
            loadingPosition="start"
            variant="contained"
            startIcon={<SvgIcon component={MetamaskSVG} inheritViewBox />}
            onClick={connectWallet}
            sx={{ textTransform: "none"}}
          >
            {account ? short(account) : "Connect Wallet"}
          </LoadingButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopAppBar