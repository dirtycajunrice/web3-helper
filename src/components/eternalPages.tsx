import React, { SyntheticEvent, useEffect, useState } from 'react';

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Grid, keyframes, styled,
  SvgIcon, TextField, Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import {getAddChainParameters} from "./chains";
import { BigNumber, Contract, ethers, utils } from 'ethers';
import {useSnackbar} from "notistack";

import { ReactComponent as MetamaskSVG } from '../assets/images/metamask-logo.svg'

const MiniERC1155ABI = [
  "function balanceOfBatch(address[] memory accounts, uint256[] memory ids) public view returns (uint256[] memory)",
  "function safeTransferFrom(address from,address to, uint256 id, uint256 amount, bytes memory data) "
]

const EternalStoryPagesAddress = '0x909EF175d58d0e17d3Ceb005EeCF24C1E5C6F390'

const EspContract = new Contract(EternalStoryPagesAddress, MiniERC1155ABI)

const PageUrl = (page: number) =>
  `https://beta.defikingdoms.com/static/media/eternal-story-page-${page}.${EternalStoryPages[page].img}.png`

const EternalStoryPages: {[index: number]: {[index: string]: string | number | BigNumber}} = {
  1: {
    index: 0,
    img: '5a5c934a',
    balance: BigNumber.from(0)
  },
  2: {
    index: 1,
    img: '302f9e68',
    balance: BigNumber.from(0)
  },
  3: {
    index: 2,
    img: '27e2125a',
    balance: BigNumber.from(0)
  },
  4: {
    index: 3,
    img: '4153f861',
    balance: BigNumber.from(0)
  },
  5: {
    index: 4,
    img: '3aba3aca',
    balance: BigNumber.from(0)
  },
  6: {
    index: 5,
    img: '09341d1e',
    balance: BigNumber.from(0)
  },
  7: {
    index: 6,
    img: '544bbfd5',
    balance: BigNumber.from(0)
  },
  8: {
    index: 7,
    img: '35a0be96',
    balance: BigNumber.from(0)
  },
  9: {
    index: 8,
    img: 'fdb8943d',
    balance: BigNumber.from(0)
  },
  //10: {
  //  index: 9,
  //  img: '',
  //  balance: BigNumber.from(0)
  //},
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const RotatingBox = styled("div")({
  animation: `${spin} 2s infinite linear`
})
const EternalPages: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [provider, setProvider] = useState<ethers.providers.Web3Provider|null>(null)
  const [wbLoad, setWbLoad] = useState<boolean>(false)
  const [account, setAccount] = useState<string|null>(null)
  const [currentChain, setCurrentChain] = useState<number|null>(null)
  const [pageBalances, setPageBalances] = useState(Array(9).fill(BigNumber.from(0)))
  const [transferDialogOpen, setTransferDialogOpen] = useState<boolean>(false);
  const [transferPageIndex, setTransferPageIndex] = useState<number>(0)
  const [DialogValidity, setDialogValidity] = useState<boolean>(false);
  const [transferInProgress, setTransferInProgress] = useState<boolean>(false)
  const [toAddress, setToAddress] = useState<string>("")
  const [toQuantity, setToQuantity] = useState<number>(0)

  const short = (a: string): string =>
    a.slice(0, 4) + "..." + a.slice(a.length - 4, a.length);

  const Success = (message: string) => enqueueSnackbar(message, {variant: "success"})
  const Error = (message: string) => enqueueSnackbar(message, {variant: "error"})

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
          if (a.length === 0) setAccount(null)
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
  }, [provider])

  useEffect(() => {
    if (!account || !provider) {
      return
    }
    const getBalances = async () => {
      const signer = await provider.getSigner()
      const contract = EspContract.connect(signer)
      const address = await signer.getAddress()
      const TenAddress = Array(Object.keys(EternalStoryPages).length).fill(address)
      const TokenIDs = Array.from(TenAddress.keys())
      const rawBalances = await contract.balanceOfBatch(TenAddress, TokenIDs)
      setPageBalances(rawBalances)
    }
    getBalances()
    const interval = setInterval(getBalances, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [account, provider])

  const setupTransferDialog = (pageIndex: number) => {
    setTransferPageIndex(pageIndex)
    setTransferDialogOpen(true)
  }

  const transfer = async () => {
    if ( ! provider ) return
    if ( ! account ) return
    setTransferInProgress(true)
    const signer = await provider.getSigner()
    const contract = EspContract.connect(signer)
    const address = await signer.getAddress()
    try {
      const tx = await contract.safeTransferFrom(address, toAddress, transferPageIndex, toQuantity, [])
      await tx.wait(1)
      Success(`Sent page ${ transferPageIndex + 1 } (${ toQuantity }) to ${ toAddress }`)
      setTransferDialogOpen(false)
      setToQuantity(0)
      setToAddress("")
    } catch (e) {
      Error(`${e}`)
      console.log(e)
    }
    setTransferInProgress(false)
  }

  const handleAddressChange = (event: SyntheticEvent) => setToAddress((event.target as HTMLInputElement).value)

  const handleQuantityChange = (event: SyntheticEvent) => setToQuantity(Number((event.target as HTMLInputElement).value))


  useEffect(() => {
    const transferInBounds = (): boolean =>
      pageBalances[transferPageIndex].gt(0)
      && pageBalances[transferPageIndex].gte(toQuantity)
      && (toQuantity > 0)

    const isValidAddress = (): boolean => {
      if (!toAddress) {
        console.log(toAddress)
        return false
      }
      try {
        utils.getAddress(toAddress)
        return true
      } catch (e) {
        return false
      }
    }
    setDialogValidity(transferInBounds() && isValidAddress())
  }, [toQuantity, toAddress, pageBalances, transferPageIndex])

  return (
    <Box sx={{ width: 0.8 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: 10000 }}
        open={transferInProgress}
      >
        <Box sx={{ m: 1, position: 'relative' }}>
          <RotatingBox>
            <img src={PageUrl(transferPageIndex + 1)} alt={'page icon'} />
          </RotatingBox>
          <Typography>Transferring...</Typography>
        </Box>
      </Backdrop>
      <p>
        Eternal Story Pages Transfer
      </p>
      <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Grid item xs={12} key="top">
          <Card>
            <CardContent sx={{ paddingBottom: "16px!important", justifyContent: "space-around", alignItems: "center", display: "flex"}}>
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
            </CardContent>
          </Card>
        </Grid>
        {pageBalances
          .map((balance, id) => (
            <Grid item
                  xs={12}
                  sm={4}
                  md={3}
                  lg={2}
                  key={`${id}-${balance.toNumber()}`}
                  sx={{ display: "flex", flexDirection: "column", height: 1 }}
            >
              <Card sx={{ height: "220.5px", flexDirection: "column", display: "flex" }}>

                <CardContent sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <CardMedia component="img" sx={{ maxWidth: "64px" }} image={PageUrl(id+1)} alt={`${id+1}`} />
                </CardContent>
                <CardHeader
                  title={`Balance: ${balance.toNumber()}`}
                  sx={{ paddingBottom: 0 }}
                />
                <Box sx={{flexGrow: 1 }} />
                <CardActions sx={{  justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    disabled={!account || balance.eq(0)}
                    onClick={() => setupTransferDialog(id)}
                  >
                    Transfer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        }
      </Grid>
      <Dialog
        open={transferDialogOpen}
        onClose={() => setTransferDialogOpen(false)}
        aria-labelledby="transfer-dialog-title"
        aria-describedby="transfer-dialog-description"
        fullWidth
        maxWidth='sm'
        sx={{ minWidth: '350px' }}
      >
        <DialogTitle id="transfer-dialog-title">
          {`Transfer Page ${transferPageIndex + 1}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ marginTop: 1}}>
            <TextField
              type='text'
              label="ETH Address"
              fullWidth helperText="Address of the person you are sending to"
              value={toAddress}
              onChange={handleAddressChange}
            />
            <TextField
              sx={{ marginTop: 1}}
              inputProps={{ min: 1, max: pageBalances[transferPageIndex].toNumber(), step: 1}}
              type='number'
              label="Quantity"
              value={toQuantity}
              onChange={handleQuantityChange}
              fullWidth helperText={`Number of pages to send. Min: 1 | Max: ${pageBalances[transferPageIndex].toNumber()}`}
            />
          </Box>

          <DialogContentText id="transfer-dialog-description">

          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between'}}>
          <Button variant="contained" color='error' onClick={() => setTransferDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={transfer} disabled={!DialogValidity}>
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


export default EternalPages