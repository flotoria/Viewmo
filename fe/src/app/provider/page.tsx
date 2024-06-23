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


function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

export default function Create() {
    return (
        <div className="text-black p-3">
            <div className="flex flex-col justify-center">
                <TextField label="YouTube Video Link" /> 
                <Button className="mt-2" variant="contained">Submit</Button>
            </div>
            <TableContainer className="mt-2" component={Paper}>
                <Table sx={{ minWidth: 650}} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell className="w-1/3">Name</TableCell>
                        <TableCell className="w-1/3">Link</TableCell>
                        <TableCell className="w-1/3">View User Reaction Statistics</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell>{row.fat}</TableCell>
                        <TableCell>{row.carbs}</TableCell>
                        <TableCell><Button variant="contained">View</Button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
    </TableContainer>
        </div>
    );
}