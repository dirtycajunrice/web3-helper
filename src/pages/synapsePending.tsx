import { SwapWidget, SUPPORTED_LOCALES } from '@uniswap/widgets';
import { providers } from 'ethers';
import React, {useEffect, useState} from 'react';
import {Box,} from "@mui/material";

import {DataGrid, GridColDef, GridValueFormatterParams} from '@mui/x-data-grid';

const Bridge = "/api/v1/transactions/recent?only_pending=true&limit=4999"

interface txData {
    from_address: string
    from_chain_id: number
    from_tx_hash: string
    kappa: string
    pending: boolean
    sent_time: number
    sent_token: string
    sent_token_symbol: string
    sent_value: string
    sent_value_formatted: number
    to_address: string
    to_chain_id: number
}

const valueFormatter = (params: GridValueFormatterParams) => {
     const a = params.value as string
    return a.slice(0, 4) + "..." + a.slice(a.length - 4, a.length);
}
const columns: GridColDef[] = [
    { field: 'id', headerName: 'tx', headerAlign: 'center', align: 'center', valueFormatter },
    { field: 'sent_time', headerName: 'Time', headerAlign: 'center', align: 'center', minWidth: 240 },
    { field: 'from_chain_id', headerName: 'From Chain', headerAlign: 'center', align: 'center' },
    { field: 'from_address', headerName: 'From Address', headerAlign: 'center', align: 'center', valueFormatter },
    { field: 'kappa', headerName: 'Kappa', headerAlign: 'center', align: 'center', valueFormatter },
    { field: 'sent_token', headerName: 'Token', headerAlign: 'center', align: 'center', valueFormatter },
    { field: 'sent_token_symbol', headerName: 'Symbol', headerAlign: 'center', align: 'center' },
    { field: 'sent_value_formatted', headerName: 'Amount', headerAlign: 'center', align: 'center' },
    { field: 'to_address', headerName: 'To Address', headerAlign: 'center', align: 'center', valueFormatter },
    { field: 'to_chain_id', headerName: 'To Chain', headerAlign: 'center', align: 'center' },
]

const CIDS = [1666600000, 53935, 43114]
const chainToName = (cid: number): string => {
    if (cid === 1666600000) return "harmony"
    if (cid === 53935) return "dfk"
    if (cid === 43114) return "avalanche"
    return "unknown"
}

interface Props {
    provider?: providers.Web3Provider
    account?: string
}

const SynapsePending: React.FC<Props> = ({provider, account}) => {
    const [tx, setTx] = useState<txData[]>()

    useEffect(() => {
        const GetPending = async () => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    "Access-Control-Allow-Origin": "*"
                },
            }
            let bridge = Bridge
            if (process.env.NODE_ENV !== "development") {
                bridge = "https://explorer.dorime.org" + Bridge
            }
            const response = await fetch(bridge, options)

            const data = await response.text()
            const json: txData[] = JSON.parse(data)
            const relevant = json.filter(trans => (
                CIDS.includes(trans.from_chain_id) && CIDS.includes(trans.to_chain_id) && ["xJEWEL", "JEWEL", "CRYSTAL", "xCRYSTAL"].includes(trans.sent_token_symbol)
            ))
            // @ts-ignore
            const rows = []
            relevant.forEach((txd) => {
                rows.push({
                    from_address: txd.from_address,
                    from_chain_id: chainToName(txd.from_chain_id),
                    id: txd.from_tx_hash,
                    kappa: txd.kappa,
                    sent_time: new Date(txd.sent_time*1000).toUTCString(),
                    sent_token: txd.sent_token,
                    sent_token_symbol: txd.sent_token_symbol,
                    sent_value_formatted: txd.sent_value_formatted,
                    to_address: txd.to_address,
                    to_chain_id: chainToName(txd.to_chain_id)
                })
            })
            // @ts-ignore
            setTx(rows)
        }
        GetPending().catch((e) => console.log(e))

        const interval = setInterval(GetPending, 30000)
        return () => {
            clearInterval(interval);
        };
    }, [])

    return (
        <Box sx={{ width: 0.8, height: "900px", marginTop: 8, backgroundColor: "white" }}>
            <DataGrid
                rows={tx || []}
                columns={columns}
                rowsPerPageOptions={[5,15,25,50,100,500]}
                checkboxSelection
                density="compact"
            />
            <SwapWidget
              jsonRpcEndpoint={"http://rpc.dfk.af:39393"}
              tokenList={"https://raw.githubusercontent.com/tradescrow/token-lists/main/build/tradescrow-all.tokenlist.json"}
              provider={provider}
              locale={SUPPORTED_LOCALES[0]}
              defaultInputTokenAddress="NATIVE"
              defaultInputAmount="1"
            />
        </Box>


    )
}

export default SynapsePending