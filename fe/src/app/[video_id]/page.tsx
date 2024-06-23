'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function VideoPage({ params }: { params: { video_id: string } }) {
    const router = useRouter();
    const { video_id } = params;

    const [videoData, setVideoData] = useState<any[] | null>(null);

    const getVideoData = async () => {
        const res = await fetch(`http://localhost:8000/api/average-emotion-scores/?video_id=${video_id}`)
        const data = await res.json();
        setVideoData(data);
    }
    useEffect(() => {
        if (!video_id) {
            router.push('/');
        }
        else {
            getVideoData();
        }
    }, [video_id, router]);

    return (
        <div className="p-2">
            <h1 className="text-black font-bold text-2xl justify-center w-full flex mb-10">Average User Reactions</h1>
            {videoData && (
                <PieChart
                    series={[
                        {
                            data: videoData?.sort((a, b) => b.average_score - a.average_score).slice(0, 5).map((emotion: any, index) => ({ id: index, label: emotion.name, value: emotion.average_score }))
                        },
                    ]}
                    width={1000}
                    height={500}
                />
            )}

            <TableContainer component={Paper} className="mt-6">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className="w-1/3 text-xl">Emotion</TableCell>
                        <TableCell className="w-1/3 text-xl">Average Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { videoData?.sort((a, b) => b.average_score - a.average_score).map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.average_score.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
          
        </div>
    );
}
