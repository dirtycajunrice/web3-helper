import React, { useState } from 'react';
import { useAsync } from "react-async"
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";

import {Token, TokenList} from "../types";
import {ENABLED_CHAINS, getAddChainParameters} from "../components/chains";
import { providers } from 'ethers';
import {useSnackbar} from "notistack";

const TokenListURL = "https://raw.githubusercontent.com/tradescrow/token-lists/main/build/tradescrow-all.tokenlist.json"

const loadTokenList = async (): Promise<TokenList> => {
    const res = await fetch(TokenListURL)
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
}

interface MainProps {
    provider?: providers.Web3Provider
    account?: string
    currentChain?: number
}

const Main: React.FC<MainProps> = ({provider, account, currentChain}) => {
    const { enqueueSnackbar } = useSnackbar();

    const { data, error, isPending } = useAsync(loadTokenList)
    const [filter, setFilter] = useState('all')

    const handleFilter = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
    }
    const filteredChain = filter !== 'all' ? ENABLED_CHAINS.filter(([id,]) => id === filter)[0][1] : {name: ""}
    const filteredChainId = filter !== 'all' ? ENABLED_CHAINS.filter(([id,]) => id === filter)[0][0] : null


    const Success = (message: string) => enqueueSnackbar(message, {variant: "success"})
    const Error = (message: string) => enqueueSnackbar(message, {variant: "error"})


    const addToken = async (token: Token) => {
        if (!provider) return
        if (!account) return
        let ethereum = (window as any).ethereum
        const added = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: token.address,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    image: token.logoURI
                }
            }
        })
        if (added) Success(`Added ${token.symbol} to Metamask`)
        else Error("User declined the request")
    }

    const switchNetwork = async (chainId: number) => {
        if (!provider) return
        if (!account) return
        let ethereum = (window as any).ethereum
        await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [getAddChainParameters(chainId)]
        })
    }

    return (
        <Box sx={{ width: 0.8, marginTop: 8 }}>
            <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <Grid item xs={12} key="top">
                    <Card sx={{ }}>
                        <CardContent sx={{ paddingBottom: "16px!important", justifyContent: "space-around", alignItems: "center", display: "flex"}}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="token-filter">Chain</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={filter}
                                    label="Chain"
                                    onChange={handleFilter}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {ENABLED_CHAINS.map(([id, chain]) => (
                                        <MenuItem value={id} key={id}>{chain.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {filter !== "all" && (
                                <Button
                                    variant="contained"
                                    disabled={currentChain?.toString() === filteredChainId}
                                    onClick={() => switchNetwork(Number(filteredChainId))}
                                >
                                    Add {filteredChain.name}
                                </Button>
                            )}

                        </CardContent>
                    </Card>
                </Grid>
                {isPending && (
                    "Loading"
                )}
                {error && (
                    `Something went wrong: ${error.message}`
                )}
                {data && (
                    data.tokens.filter(token => token.chainId.toString() === filter || filter === "all").map(token => (
                        <Grid item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              key={`${token.symbol}-${token.chainId}`}
                              sx={{ width: "300px", display: "flex", flexDirection: "column", height: 1 }}
                        >
                            <Card sx={{ height: "220.5px", flexDirection: "column", display: "flex" }}>
                                <CardHeader title={token.symbol} subheader={token.name} sx={{ paddingBottom: 0 }}/>
                                <CardContent sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                                    <CardMedia component="img" sx={{ maxWidth: "64px" }} image={token.logoURI} alt={token.name} />
                                </CardContent>
                                <Box sx={{flexGrow: 1 }} />
                                <CardActions sx={{  justifyContent: "center" }}>
                                    <Button
                                        variant="contained"
                                        disabled={!account}
                                        onClick={() => token.chainId === currentChain ? addToken(token) : switchNetwork(token.chainId)}
                                    >
                                        {token.chainId === currentChain ? "Add" : "Switch Network"}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    )
}

export default Main