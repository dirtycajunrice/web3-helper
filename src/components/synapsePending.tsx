import React, {useEffect, useState} from 'react';
import {
    Box,
} from "@mui/material";
import {Token, TokenList} from "../types";

import {useSnackbar} from "notistack";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

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

const columns: GridColDef[] = [
    { field: 'id', headerName: 'tx' },
    { field: 'from_chain_id', headerName: 'From Chain' },
    { field: 'from_address', headerName: 'From Address' },
    { field: 'kappa', headerName: 'Kappa' },
    { field: 'sent_time', headerName: 'Time' },
    { field: 'sent_token', headerName: 'Token' },
    { field: 'sent_token_symbol', headerName: 'Symbol' },
    { field: 'sent_value_formatted', headerName: 'Amount' },
    { field: 'to_address', headerName: 'To Address' },
    { field: 'to_chain_id', headerName: 'To Chain' },
]

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
            const response = await fetch(Bridge, options)

            const data = await response.text()
            const json: txData[] = JSON.parse(data)
            console.log(json)
            const relevant = json.filter(trans => trans.from_chain_id === 53935 || trans.to_chain_id === 53935)
            // @ts-ignore
            const rows = []
            relevant.forEach((txd) => {
                rows.push({
                    from_address: txd.from_address,
                    from_chain_id: txd.from_chain_id,
                    id: txd.from_tx_hash,
                    kappa: txd.kappa,
                    pending: txd.pending,
                    sent_time: txd.sent_time,
                    sent_token: txd.sent_token,
                    sent_token_symbol: txd.sent_token_symbol,
                    sent_value_formatted: txd.sent_value_formatted,
                    to_address: txd.to_address,
                    to_chain_id: txd.to_chain_id
                })
            })
            // @ts-ignore
            setTx(rows)
        }
        GetPending().catch((e) => console.log(e))

    }, [])



    return (
        <Box sx={{ width: 0.8, height: "900px", backgroundColor: "white" }}>
            <DataGrid
                rows={tx || []}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </Box>

    )
}

export default SynapsePending