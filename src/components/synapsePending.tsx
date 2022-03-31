import React, {useEffect, useState} from 'react';
import {Box,} from "@mui/material";
import {Token, TokenList} from "../types";

import {useSnackbar} from "notistack";
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

const loadTokenList = async (): Promise<TokenList> => {
    const res = await fetch(Bridge)
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
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
const SynapsePending: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [filter, setFilter] = useState('all')
    const [tx, setTx] = useState<txData[]>()


    const Success = (message: string) => enqueueSnackbar(message, {variant: "success"})
    const Error = (message: string) => enqueueSnackbar(message, {variant: "error"})


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
            const response = await fetch(Bridge, options)

            const data = await response.text()
            const json: txData[] = JSON.parse(data)
            const relevant = json.filter(trans => CIDS.includes(trans.from_chain_id) && CIDS.includes(trans.to_chain_id))
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

    }, [])



    return (
        <Box sx={{ width: 0.555, height: "900px", backgroundColor: "white" }}>
            <DataGrid
                rows={tx || []}
                columns={columns}
                rowsPerPageOptions={[5,15,25,50,100,500]}
                checkboxSelection
                density="compact"
                disableExtendRowFullWidth

            />
        </Box>

    )
}

export default SynapsePending