import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel, LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { DoNotDisturbOff, FactCheck, TransferWithinAStation } from '@mui/icons-material';

import RotatingBox from '../components/RotatingBox';
import { BigNumber, Contract, providers, utils } from 'ethers';
import {useSnackbar} from "notistack";
import TradescrowRouterUpgradeableArtifact from '../assets/ABIs/TradescrowRouterUpgradeable.json';
import TokenList from '../assets/tradescrow-all.tokenlist.json';

const Router = '0x07A1Ffd10aC8672Cb2E7C9D8138A574F97e80a2a'

const RouterContract = new Contract(Router, TradescrowRouterUpgradeableArtifact.abi)

const Adapters: { [index: string]: string } = {
  "0x2d3876A9CBA317401e3D30799A9c0a92a30fE732": "SushiSwap",
  "0xcF0d0F58021c4BF8089C34b08821D8B0169cA690": "DFK",
}

const getTokenByAddress = (address: string) => TokenList.tokens.find(t => t.address === address)
interface BatchTransferProps {
  provider?: providers.Web3Provider
  account?: string
}

const DexAggregator: React.FC<BatchTransferProps> = ({provider, account}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [fromToken, setFromToken] = useState<string>("")
  const [toToken, setToToken] = useState<string>("")
  const [amountIn, setAmountIn] = useState<BigNumber>(BigNumber.from(0))
  const [transferInProgress, setTransferInProgress] = useState<boolean>(false)
  const [approvalInProgress, setApprovalInProgress] = useState<boolean>(false)
  const [queryingNftIds, setQueryingNftIds] = useState<boolean>(false)
  const [nftCollectionAddress, setNftCollectionAddress] = useState<string>("")
  const [toAddress, setToAddress] = useState<string>("")
  const [nftIds, setNftIds] = useState<number[]>([])
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false)
  const [selectedNftIds, setSelectedNftIds] = useState<number[]>([])
  const [transferValidity, setTransferValidity] = useState<boolean>(false)
  const [bestPath, setBestBath] = useState<any>()
  const Success = (message: string) => enqueueSnackbar(message, {variant: "success"})
  const Error = (message: string) => enqueueSnackbar(message, {variant: "error"})

  useEffect(() => {
    //if (!account || !provider) {
    //  return
    //}
    //const getBalances = async (interval?: boolean) => {
    //  const signer = await provider.getSigner()
    //  const contract = new Contract(nftCollectionAddress, MiniERC721ABI, signer)
    //  const address = await signer.getAddress()
    //  if (nftCollectionAddress === HeroAddress) {
    //    const rawHeroIds: BigNumber[] = await contract.getUserHeroes(address)
    //    setNftIds(rawHeroIds.map(h => h.toNumber()))
    //  } else {
    //    if (!interval) {
    //      setQueryingNftIds(true)
    //    }
    //    const count = await contract.balanceOf(address)
    //    let ids = []
    //    for (let i = 0; i < count.toNumber(); i++) {
    //      const id = await contract.tokenOfOwnerByIndex(address, i)
    //      ids.push(id.toNumber())
    //    }
    //    setNftIds(ids)
    //    if (!interval) {
    //      setQueryingNftIds(false)
    //    }
    //  }
    //  const approved = await contract.isApprovedForAll(address, NFTUtilitiesAddress)
//
    //  setIsApprovedForAll(approved)
    //}
    //getBalances()
    //const interval = setInterval(getBalances, 5000, true)
    //return () => {
    //  clearInterval(interval)
    //}
  }, [nftCollectionAddress, account, provider])

  useEffect(() => {

    const isValidAddress = (): boolean => {
      console.log(toAddress)
      if (!toAddress) {
        return false
      }
      try {
        utils.getAddress(toAddress)
        return true
      } catch (e) {
        return false
      }
    }
    setTransferValidity( selectedNftIds.length > 0 && isApprovedForAll && isValidAddress())
  }, [selectedNftIds, isApprovedForAll, toAddress])

  const handleSearch = async () => {
    if ( !provider || !account ) {
      return
    }
    const signer = await provider.getSigner()
    const contract = RouterContract.connect(signer)

    try {
      const bp = await contract.findBestPath(amountIn, fromToken, toToken, 4)
      setBestBath(bp)
    } catch (e) {
      Error(`${e}`)
      console.log(e)
    }
  }
  const handleSwap = async () => {
    if ( !provider || !account ) {
      return
    }
    const signer = await provider.getSigner()
    const contract = RouterContract.connect(signer)

    try {
      console.log(bestPath)
      const swap = await contract.swapNoSplit([bestPath.amounts[0], bestPath.amounts[1], bestPath.path, bestPath.adapters], account, 0)
      await swap.wait(1)
      console.log(swap)
    } catch (e) {
      Error(`${e}`)
      console.log(e)
    }
  }

  return (
    <Box sx={{ width: 0.8, marginTop: 8 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: 10000 }}
        open={transferInProgress || approvalInProgress}
      >
        <Box sx={{ m: 1, position: 'relative' }}>
          <RotatingBox>
            { approvalInProgress && (
              isApprovedForAll
              ? <DoNotDisturbOff sx={ { fontSize: '5rem' } }/>
              : <FactCheck sx={ { fontSize: '5rem' } }/>
            )}
            { transferInProgress && <TransferWithinAStation sx={ { fontSize: '5rem' } } /> }
          </RotatingBox>
          <Typography>
            { approvalInProgress && (
              isApprovedForAll
                ? "Removing contract access..."
                : "Giving contract access..."
            )}
            { transferInProgress && "Transferring..." }
          </Typography>
        </Box>
      </Backdrop>
      <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Grid item xs={6} key="card">
          <Card>
            <CardContent sx={{ paddingBottom: "16px!important", justifyContent: "space-around", alignItems: "center", display: "flex"}}>
              <Box sx={{ marginTop: 1}}>
                <FormControl fullWidth sx={{ marginBottom: 1 }}>
                  <InputLabel id='from-coin'>From</InputLabel>
                  <Select
                    labelId='from-coin'
                    id='from-coin-select'
                    value={fromToken}
                    label="From"
                    onChange={(event: SelectChangeEvent) => setFromToken((event.target as HTMLSelectElement).value)}
                  >
                    {TokenList.tokens.map(t => (
                      <MenuItem key={t.name} value={t.address} selected>{t.name}</MenuItem>
                    ))}

                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginBottom: 1 }}>
                  <InputLabel id='to-coin'>To</InputLabel>
                  <Select
                    labelId='to-coin'
                    id='to-coin-select'
                    value={toToken}
                    label="To"
                    onChange={(event: SelectChangeEvent) => setToToken((event.target as HTMLSelectElement).value)}
                  >
                    {TokenList.tokens.map(t => (
                      <MenuItem key={t.name} value={t.address} selected>{t.name}</MenuItem>
                    ))}

                  </Select>
                </FormControl>
                <TextField
                  type='text'
                  label="Amount"
                  fullWidth helperText={`Amount: ${utils.formatEther(amountIn)}`}
                  value={amountIn}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setAmountIn(BigNumber.from(event.target.value))}
                />
                {queryingNftIds && <LinearProgress />}

              </Box>
            </CardContent>
            <CardActions sx={{  justifyContent: "space-around" }}>
              <Button
                variant="contained"
                onClick={handleSwap}
              >
                Swap
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {bestPath && (
          <Grid item xs={7} key="card2">
            <Card>
              <CardContent sx={{ paddingBottom: "16px!important", justifyContent: "space-around", alignItems: "center", display: "flex"}}>
                <Box sx={{ marginTop: 1}}>
                  <Typography>Dex: {Adapters[bestPath.adapters[0] as string]}</Typography>
                  {bestPath.path.map((p: string, i: number) => (
                    <Typography key={i}>{getTokenByAddress(p)?.name} - {utils.formatUnits(bestPath.amounts[i])}</Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}


export default DexAggregator