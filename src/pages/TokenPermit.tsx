import chains from '@services/chains';
import { selectGlobalLoading } from '@state/global/hooks';
import { setGlobalLoading } from '@state/global/reducer';
import { useAppDispatch, useAppSelector } from '@state/hooks';
import ERC20Permit from '@utils/contracts/ERC20Permit';
import { permitToJson, postJSON } from '@utils/jsonBin';
import { BigNumber, constants, utils } from 'ethers';
import React, { useState, ChangeEvent, Fragment, useMemo } from 'react';
import {
  Alert,
  AlertTitle,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useSnackbar } from "notistack";
import { useAccount, useSigner, useNetwork } from 'wagmi';
import {LoadingButton} from "@mui/lab";

const allowedTokens = {
  [chains.avalanche.id]: {
    cEVO: '0x7B5501109c2605834F7A4153A75850DB7521c37E'
  }
}

const spender = '0x4082e997Ec720A4894EFec53b0d9AabfeeA44cBE';

const TokenPermit = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const loading = useAppSelector(selectGlobalLoading);
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('')
  const [tokenName, setTokenName] = useState<string>("");
  const [acceptToS, setAcceptToS] = useState<boolean>(false);

  const amountValid = useMemo(() => {
    const v = amount.trim();
    if (v) {
      if (v === '0') {
        return true;
      }
      if (!isNaN(Number(v))) {
        if (Number(v) > 0) {
          return true;
        }
      }
    }
    return false;
  }, [amount]);

  const handleChangeToken = (event: SelectChangeEvent) => {
    setTokenName(event.target.value);
  }

  const handleChangeDeadline = (event: SelectChangeEvent) => {
    setDeadline(event.target.value);
  }
  const toggleMax = () => {
    setAmount(amount === '0' ? '' : '0')
  }
  const signPermit = async () => {
    if (!signer || !chain || !address) {
      return
    }
    const value = Number(amount) === 0
      ? constants.MaxUint256
      : utils.parseEther(amount.split('.').length > 1 ? amount : amount + ".0");

    const deadlineTime = Number(deadline) === 0
      ? constants.MaxUint256
      : BigNumber.from(Math.floor(Date.now() / 1000) + Number(deadline));

    dispatch(setGlobalLoading(true));
    try {
      const contract = new ERC20Permit(allowedTokens[chain.id][tokenName], signer);
      const message = await contract.getPermitString(spender, undefined, value, deadlineTime);
      const domain = await contract.domain();
      const data = permitToJson(address, spender, domain, value.toString(), deadlineTime.toString(), message);
      await postJSON(data);
      enqueueSnackbar('Success', {variant: "success"});
    } catch (e: any) {
      enqueueSnackbar(String(e), {variant: "error"})
    }
    dispatch(setGlobalLoading(false))
  }

  return (
      <Stack spacing={2} width={1} maxWidth="md">
        <Card>
          <CardHeader title="Token Permit" />
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="token-label">Token</InputLabel>
                <Select labelId="token-label" value={tokenName} label="Token" onChange={handleChangeToken}>
                  {Object.entries(allowedTokens)
                    .filter(([chainId]) => chain && chain.id === Number(chainId))
                    .map(([, data]) => (
                      Object.entries(data).map(([name], i) => (
                          <MenuItem key={i} value={name}>{name}</MenuItem>
                        )
                      )
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth required variant="outlined">
                <InputLabel>Amount</InputLabel>
                <OutlinedInput
                  label="Amount"
                  value={amount}
                  disabled={!tokenName || amount === '0'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
                  type="number"
                  endAdornment={
                    <InputAdornment position="end">
                      <FormControlLabel
                        control={<Checkbox checked={amount === '0'} disabled={!tokenName} onChange={toggleMax} />}
                        label="Max"
                        labelPlacement="start"
                      />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel id="deadline-label">Deadline</InputLabel>
                <Select
                  labelId="deadline-label"
                  value={deadline}
                  label="Deadline"
                  onChange={handleChangeDeadline}
                  disabled={!amountValid}
                >
                  {[0, 60, 180, 360, 720, 1440].map(m => (
                    <MenuItem key={m} value={m}>
                      {m === 0 ? 'Forever' : `${m / 60} Hour${m === 60 ? '' : 's'}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {chain && deadline !== '' && amountValid && (
                <Fragment>
                  <Alert severity="warning" sx={{ justifyContent: 'center' }}>
                    <AlertTitle sx={{ textAlign: 'center' }}>Disclaimer</AlertTitle>
                    <Typography>
                      Signing this permit authorizes DirtyCajunRice for
                    </Typography>
                    <List sx={{ width: 1, listStyleType: 'disc', pl: 4 }} dense>
                      {[
                        '1 transaction nonce',
                        Number(deadline) === 0
                          ? 'At any time'
                          : `Within ${ Number(deadline) / 60 } Hour${ Number(deadline) > 60 ? 's' : ''}`,
                        (amountValid ? amount === '0' ? 'All' : Number(amount).toLocaleString() : '0') + ` ${tokenName}`
                      ].map((v, i) => (
                        <ListItem key={i} sx={{ display: 'list-item' }} dense>
                          <ListItemText>{v}</ListItemText>
                        </ListItem>
                      ))}
                    </List>
                    <Typography>on the {chain.name} blockchain</Typography>
                  </Alert>
                  <FormControlLabel
                    control={<Checkbox checked={acceptToS} onChange={() => setAcceptToS(!acceptToS)} />}
                    label={"I understand and accept the above disclaimer"}
                    sx={{ justifyContent: 'center' }}
                  />
                </Fragment>
              )}
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <LoadingButton
              variant="contained"
              loading={loading}
              loadingPosition="start"
              startIcon={<Edit />}
              disabled={!acceptToS}
              onClick={signPermit}
            >
              Sign
            </LoadingButton>
          </CardActions>
        </Card>
      </Stack>
  )
}


export default TokenPermit;
