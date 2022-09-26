import React, { useState, ChangeEvent, Fragment, useEffect, useMemo } from 'react';

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid, IconButton, Stack,
  TextField,
  Typography,
} from '@mui/material';
import {ContentCopy, Edit, FactCheck} from '@mui/icons-material';
import RotatingBox from '../components/RotatingBox';
import { utils } from 'ethers';
import {useSnackbar} from "notistack";
import CheckMarkGif from '../assets/images/checkmark.gif';
import { useAccount, useSignMessage } from "wagmi";
import {LoadingButton} from "@mui/lab";

const BatchTransfer= () => {
  const { enqueueSnackbar } = useSnackbar();
  const { address } = useAccount();

  const [approvalInProgress, setApprovalInProgress] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>();
  const [hovered, setHovered] = useState<boolean>(false);
  const [verifyMessageText, setVerifyMessageText] = useState<string>("");
  const [verifyMessageAddress, setVerifyMessageAddress] = useState<string>("");
  const Success = (message: string) => enqueueSnackbar(message, {variant: "success"});
  const Error = (message: string) => enqueueSnackbar(message, {variant: "error"});

  const hash = `78f8e120ba82513afca811d65d898d08`;

  const message = useMemo(() => (`
    I am signing this message to show proof of ownership.
      domain: cajun.tools
      address: ${verifyMessageAddress || address || 'unknown'}
      hash: ${hash}
  `), [verifyMessageAddress, address]);

  const onError = (error: Error) => {
    console.log(error);
    Error(error.message)
  }
  const { signMessage, data, reset, isLoading } = useSignMessage({ message, onError });

  const verifyMessage = async () => {
    const match = message.match(/(0x[0-9A-Za-z]+)/g);
    try {
      const signerAddress = utils.verifyMessage(message, verifyMessageText);
      if (match && match.length === 1) {
        const address = match[0];
        if (address === signerAddress) {
          setVerified(true)
          Success('Message verified');
          return;
        }
      }
    } catch (e) {
      //
    }

    setVerified(false);
    Error('Message does not match');
  }

  const signReset = () => {
    reset();
    Success('Sign reset!');
  }

  const verifiedReset = () => {
    setVerified(undefined);
    setVerifyMessageText('');
    setVerifyMessageAddress('');
    Success('Verify message reset!');
  }

  const copySigned = () => {
    if (!data) {
      return;
    }
    navigator.clipboard.writeText(data).then(() => Success("Copied to clipboard"))
  }
  return (
    <Box sx={{ width: 0.8, marginTop: 8 }}>
      <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Grid item xs={6} sx={{ marginX: 2 }}>
          <Card>
            <CardHeader title="Sign Message" />
            {data ? (
              <Fragment>
                <CardContent
                  onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}
                  sx={{ position: 'relative' }}
                >
                  <TextField
                    label="Signed Message"
                    multiline
                    minRows={2}
                    maxRows={5}
                    value={data}
                    disabled
                    variant="filled"
                    sx={{ width: 0.95, pointerEvents: 'none' }}
                  />
                  <Backdrop
                    open={hovered}
                    sx={{
                      position: 'absolute',
                      marginTop: '16px',
                      marginBottom: '24px',
                      marginX: '32px',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    <IconButton onClick={copySigned}>
                      <ContentCopy sx={{ color: 'white' }} />
                    </IconButton>
                  </Backdrop>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-around'}}>
                  <Button variant="contained" disabled={!address} onClick={signReset}>
                    Reset
                  </Button>
                </CardActions>
              </Fragment>
            ) : (
              <Fragment>
                <CardContent>
                  <TextField
                    label="Message"
                    multiline
                    minRows={5}
                    maxRows={10}
                    value={message}
                    disabled
                    variant="filled"
                    sx={{ width: 0.95, pointerEvents: 'none' }}
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-around'}}>
                  <LoadingButton
                    variant="contained"
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<Edit />}
                    disabled={!address}
                    onClick={() => signMessage()}
                  >
                    Sign
                  </LoadingButton>
                </CardActions>
              </Fragment>
            )}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader title="Verify Message" />
            {verified ? (
              <Fragment>
                <CardContent>
                  <TextField
                    label="Address"
                    value={verifyMessageAddress}
                    disabled
                    variant="filled"
                    sx={{ width: 0.95, marginBottom: 1 }}
                  />
                  <Stack direction="row" spacing={1} sx={{ marginTop: 1, justifyContent: 'center' }}>
                    <img width="32" src={CheckMarkGif} alt="checkmark" />
                    <Typography variant="h6">Message is valid</Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-around'}}>
                  <Button
                    variant="contained"
                    disabled={!address}
                    onClick={verifiedReset}
                  >
                    Clear
                  </Button>
                </CardActions>
              </Fragment>
            ) : (
              <Fragment>
                <CardContent>
                  <TextField
                    label="Address"
                    value={verifyMessageAddress}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setVerifyMessageAddress(event.target.value)}
                    variant="filled"
                    sx={{ width: 0.95, marginBottom: 1 }}
                  />
                  <TextField
                    label="Signed Message"
                    multiline
                    minRows={1}
                    maxRows={5}
                    value={verifyMessageText}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setVerifyMessageText(event.target.value)}
                    variant="filled"
                    sx={{ width: 0.95 }}
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-around'}}>
                  <Button
                    variant="contained"
                    disabled={!address || !verifyMessageText}
                    onClick={verifyMessage}
                  >
                    Verify
                  </Button>
                </CardActions>
              </Fragment>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}


export default BatchTransfer