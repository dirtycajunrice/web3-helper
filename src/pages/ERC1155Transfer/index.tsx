import ImageViewer from '@pages/ERC1155Transfer/imageViewer';
import React, { SyntheticEvent, useEffect, useState } from 'react';

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import { BigNumber, Contract, utils } from 'ethers';
import {useSnackbar} from "notistack";

import RotatingBox from '@components/RotatingBox';

import ERC1155Artifact from '../../artifacts/CosmicBadges.json';
import {useAccount, useContractRead, useContractWrite, usePrepareContractWrite} from "wagmi";


const CUBadges = '0x03A37A09be3E90bE403e263238c1aCb14a341DEf';

const PageUrl = (page: number) =>
  `https://images.cosmicuniverse.io/cosmic-badges/${page}`

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

const Index = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { address } = useAccount();
  const [transferDialogOpen, setTransferDialogOpen] = useState<boolean>(false);
  const [transferPageIndex, setTransferPageIndex] = useState<number>(0)
  const [DialogValidity, setDialogValidity] = useState<boolean>(false);
  const [transferInProgress, setTransferInProgress] = useState<boolean>(false)
  const [toAddress, setToAddress] = useState<string>("")
  const [toQuantity, setToQuantity] = useState<number>(0)
  const [imageViewer, setImageViewer] = useState({ src: '', open: false });

  const ids = [0, 1, 2, 3, 4, 5, 6];
  const addresses = Array(ids.length).fill(address);

  const contractRead = useContractRead({
    addressOrName: CUBadges,
    functionName: 'balanceOfBatch',
    contractInterface: ERC1155Artifact.abi,
    args: [addresses, ids],
    chainId: 43114
  })

  const { config } = usePrepareContractWrite({
    addressOrName: CUBadges,
    contractInterface: ERC1155Artifact.abi,
    functionName: 'safeTransferFrom',
    args: [address, toAddress, transferPageIndex, toQuantity, []]
  })
  const contractWrite = useContractWrite(config)

  const Success = (message: string) => enqueueSnackbar(message, {variant: "success"})
  const Error = (message: string) => enqueueSnackbar(message, {variant: "error"})

  useEffect(() => {
    if (contractRead.error) {
      console.log("Error:", contractRead.error);
      return;
    }
    if (contractRead.isLoading) {
      console.log("isLoading");
      return;
    }

    console.log(contractRead.data)
  }, [contractRead.isLoading, contractRead.error, contractRead.data, address])

  const setupTransferDialog = (pageIndex: number) => {
    setTransferPageIndex(pageIndex)
    setTransferDialogOpen(true)
  }

  const transfer = async () => {
    if (!address) {
      return
    }
    setTransferInProgress(true)
    contractWrite.write?.();
    if (contractWrite.isSuccess) {
      Success(`Sent page ${ transferPageIndex + 1 } (${ toQuantity }) to ${ toAddress }`)
      setTransferDialogOpen(false)
      setToQuantity(0)
      setToAddress("")
    } else if (contractWrite.error) {
      Error(`${contractWrite.error.message}`)
      console.log(contractWrite.error)
    }
    setTransferInProgress(false)
  }

  const handleAddressChange = (event: SyntheticEvent) => setToAddress((event.target as HTMLInputElement).value)

  const handleQuantityChange = (event: SyntheticEvent) => setToQuantity(Number((event.target as HTMLInputElement).value))


  useEffect(() => {
    const transferInBounds = (): boolean =>
      contractRead.data
      && contractRead.data[transferPageIndex].gt(0)
      && contractRead.data[transferPageIndex].gte(toQuantity)
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
  }, [toQuantity, toAddress, contractRead.data, transferPageIndex])

  return (
    <Box sx={{ width: 0.8, marginTop: 8 }}>
      <ImageViewer
        close={() => setImageViewer({ ...imageViewer, open: false })}
        open={imageViewer.open}
        src={imageViewer.src}
      />
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
      <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
        {contractRead.data && contractRead.data
          .map((balance, id) => (
            <Grid item
                  xs={12}
                  sm={4}
                  md={3}
                  lg={2}
                  key={`${id}-${balance.toNumber()}`}
                  sx={{ display: "flex", flexDirection: "column", height: 1 }}
            >
              <Card
                onClick={() => setImageViewer({ src: PageUrl(id), open: true })}
                sx={{
                  height: "220.5px",
                  flexDirection: "column",
                  display: "flex",
                  maxWidth: 310,
                  transition: "transform 0.15s ease-in-out",
                  "&:hover": { transform: "scale3d(1.05, 1.05, 1)" },
              }}
              >

                <CardContent sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <CardMedia component="img" sx={{ maxWidth: "64px" }} image={PageUrl(id)} alt={`${id+1}`} />
                </CardContent>
                <CardHeader
                  title={`Owned: ${balance.toNumber()}`}
                  sx={{ paddingBottom: 0 }}
                />
                <Box sx={{flexGrow: 1 }} />
                <CardActions sx={{  justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    disabled={!address || balance.eq(0)}
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
              inputProps={{ min: 1, max: contractRead.data?.[transferPageIndex].toNumber(), step: 1}}
              type='number'
              label="Quantity"
              value={toQuantity}
              onChange={handleQuantityChange}
              fullWidth helperText={`Number of pages to send. Min: 1 | Max: ${contractRead.data?.[transferPageIndex]?.toNumber()}`}
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


export default Index