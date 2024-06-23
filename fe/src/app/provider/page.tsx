'use client'

import { Button, TextField } from "@mui/material";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/navigation'

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}



export default function Create() {

    const [videoLink, setVideoLink] = React.useState<string>('')
    const [videoRows, setVideoRows] = React.useState<any[]>([])
    const router = useRouter();

    const submitVideoLink = () => {
        fetch('http://localhost:8000/api/addVid',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ video_id: videoLink })
            })
    }

    const getVideoLinks = async () => {
        const response = await fetch('http://localhost:8000/api/getVids');
        const data = await response.json();

        setVideoRows(data);
    }

    React.useEffect(() => {
        getVideoLinks();
    }, [])

    const handleViewClick = (video_id: string) => {
        router.push(`/${video_id}`)
    }

    return (
        <div className="text-black p-3">
            <TableContainer className="mt-2" component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="w-1/3 text-xl">Link</TableCell>
                            <TableCell className="w-1/3 text-xl">View User Reaction Statistics</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {videoRows.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell><a href={`https://www.youtube.com/watch?v=${row.video_id}`} target="_blank" rel="noopener noreferrer">
                                    https://www.youtube.com/watch?v={row.video_id}
                                </a></TableCell>
                                <TableCell><Button variant="contained" onClick={() => handleViewClick(row.video_id)} style={{ background: 'linear-gradient(45deg, #56CCF2, #2F80ED)' }}>View</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}