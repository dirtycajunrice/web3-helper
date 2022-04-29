import React, { SyntheticEvent, useEffect, useState } from 'react';

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
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { DoNotDisturbOff, FactCheck, TransferWithinAStation } from '@mui/icons-material';

import NFTUtilitiesABI from '../assets/ABIs/NFTUtilities.json';
import RotatingBox from '../components/RotatingBox';
import { BigNumber, Contract, providers, utils } from 'ethers';
import {useSnackbar} from "notistack";

const MiniERC721ABI = [
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function getUserHeroes(address _address) view returns (uint256[])"
]

const HeroAddress = '0x5F753dcDf9b1AD9AabC1346614D1f4746fd6Ce5C'
const NFTUtilitiesAddress = '0x6F16924A4C10d525E0f03700e25259AD0d6f0591'

const HeroContract = new Contract(HeroAddress, MiniERC721ABI)
const NFTUtilitiesContract = new Contract(NFTUtilitiesAddress, NFTUtilitiesABI)


interface BatchTransferProps {
  provider?: providers.Web3Provider
  account?: string
}

const BatchTransfer: React.FC<BatchTransferProps> = ({provider, account}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [transferInProgress, setTransferInProgress] = useState<boolean>(false)
  const [approvalInProgress, setApprovalInProgress] = useState<boolean>(false)
  const [nftCollectionAddress, setNftCollectionAddress] = useState<string>(HeroAddress)
  const [toAddress, setToAddress] = useState<string>("")
  const [heroIds, setHeroIds] = useState<number[]>([])
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false)
  const [selectedHeroIds, setSelectedHeroIds] = useState<number[]>([])
  const [transferValidity, setTransferValidity] = useState<boolean>(false)

  const Success = (message: string) => enqueueSnackbar(message, {variant: "success"})
  const Error = (message: string) => enqueueSnackbar(message, {variant: "error"})

  useEffect(() => {
    if (!account || !provider) {
      return
    }
    const getBalances = async () => {
      const signer = await provider.getSigner()
      const contract = HeroContract.connect(signer)
      const address = await signer.getAddress()
      const rawHeroIds: BigNumber[] = await contract.getUserHeroes(address)
      const approved = await contract.isApprovedForAll(address, NFTUtilitiesAddress)
      setHeroIds(rawHeroIds.map(h => h.toNumber()))
      setIsApprovedForAll(approved)
    }
    getBalances()
    const interval = setInterval(getBalances, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [account, provider])

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
    setTransferValidity( selectedHeroIds.length > 0 && isApprovedForAll && isValidAddress())
  }, [selectedHeroIds, isApprovedForAll, toAddress])

  const handleTransfer = async () => {
    if ( ! provider ) return
    if ( ! account ) return
    setTransferInProgress(true)
    const signer = await provider.getSigner()
    const contract = NFTUtilitiesContract.connect(signer)
    const address = await signer.getAddress()
    try {
      console.log(address, toAddress, HeroAddress)
      const tx = await contract.batchTransfer721(address, toAddress, HeroAddress, selectedHeroIds)
      await tx.wait(1)
      Success(`Sent ${selectedHeroIds.length} heroes to ${ toAddress }`)
      setSelectedHeroIds([])
    } catch (e) {
      Error(`${e}`)
      console.log(e)
    }
    setTransferInProgress(false)
  }

  const handleApproveForAll = async () => {
    if (!account || !provider) {
      return
    }
    setApprovalInProgress(true)
    const signer = await provider.getSigner()
    const contract = HeroContract.connect(signer)
    try {
      const tx = await contract.setApprovalForAll(NFTUtilitiesAddress, !isApprovedForAll)
      await tx.wait(1)
      Success(`${!isApprovedForAll ? "Approved" : "Denied"} access to transfer`)
      setApprovalInProgress(false)
      setIsApprovedForAll(!isApprovedForAll)
    } catch (e) {
      Error(`${e}`)
      console.log(e)
      setApprovalInProgress(false)
    }
  }

  const handleToAddressChange = (event: SyntheticEvent) => setToAddress((event.target as HTMLInputElement).value)
  const handleSelectedHeroIds = (event: SelectChangeEvent<typeof heroIds>) => {
    const { target: { value } } = event;
    setSelectedHeroIds(typeof value === 'string' ? value.split(',').map(v => Number(v)) : value)
  }

  const handleNFTCollection = (event: SelectChangeEvent) => setNftCollectionAddress((event.target as HTMLSelectElement).value)

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
                  <InputLabel id='nft-collection'>NFT Collection</InputLabel>
                  <Select
                    labelId='nft-collection'
                    id='nft-collection-select'
                    value={nftCollectionAddress}
                    label="NFT Collection"
                    onChange={handleNFTCollection}
                    disabled={true}
                  >
                    <MenuItem value={HeroAddress} selected>DFK Hero</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  type='text'
                  label="To Address"
                  fullWidth helperText="Address of the person you are sending to"
                  value={toAddress}
                  onChange={handleToAddressChange}
                />
                <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                  <InputLabel id="hero-select-label">Heroes</InputLabel>
                  <Select
                    labelId="hero-select-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedHeroIds}
                    onChange={handleSelectedHeroIds}
                    input={<OutlinedInput id="select-multiple-chip" label="Heroes" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.sort().map((value) => (
                          <Chip key={value} label={"#"+value} />
                        ))}
                      </Box>
                    )}
                  >
                    {heroIds.sort().map((id) => (
                      <MenuItem
                        key={id}
                        value={id}
                      >
                        {"#"+id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
            <CardActions sx={{  justifyContent: "space-between" }}>
              <Button
                variant="contained"
                disabled={selectedHeroIds.length === 0}
                onClick={() => selectedHeroIds.length === heroIds.length ? setSelectedHeroIds([]) : setSelectedHeroIds(heroIds)}
              >
                {heroIds.length === 0
                  ? "No heroes"
                  : selectedHeroIds.length === heroIds.length
                    ? "Clear"
                    : "Select"
                } All Heroes
              </Button>
              <Button
                variant="contained"
                onClick={handleApproveForAll}
              >
                {isApprovedForAll ? "Deny" : "Approve"} Contract
              </Button>
              <Button
                variant="contained"
                disabled={!transferValidity}
                onClick={handleTransfer}
              >
                Transfer
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}


export default BatchTransfer