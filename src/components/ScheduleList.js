import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { Button, Grid } from "@mui/material";
import { auth, db } from "../firebase.js";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ref, onValue } from "firebase/database";

import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function SceduleList() {
    const navigate = useNavigate();
    const [jadwal, setJadwal] = useState([]);
    const [searchParams] = useSearchParams();
    const [formatedTime, setFormatedTime] = useState([]);


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/');
            }
        })
    });

    useEffect(() => {
        onValue(ref(db, 'kloter/' + searchParams.get('id')), snapshot => {
            var dataList = [];

            snapshot.forEach(childSnapshot => {
                let key = childSnapshot.key;
                let dataString = '' + childSnapshot.val().pukul
                let minute = dataString.slice(-2);
                let hour = dataString.substring(0, minute.length - 1);
                if (hour.length === 1) {
                    hour = "0" + hour
                }
                let time = (hour + ":" + minute);
                dataList.push({
                    "key": key,
                    "kegiatan": childSnapshot.val().kegiatan,
                    "hari": childSnapshot.val().hari,
                    "tanggal": childSnapshot.val().tanggal,
                    "pukul": time
                })
            })
            setJadwal(dataList);
        })
    }, [searchParams]);

    const generateDate = (data) => {
        const year = ('' + data.tanggal).substring(0, 4);
        const month = ('' + data.tanggal).substring(4, 6);
        const day = ('' + data.tanggal).substring(6, 8);
        return day + "-" + month + "-" + year
    }

    const generateTime = () => {
        let time = [];
        jadwal.forEach(child => {
            let dataString = '' + child.pukul
            let minute = dataString.slice(-2);
            let hour = dataString.substring(0, minute.length - 1);
            if (hour.length === 1) {
                hour = "0" + hour
            }
            time.push((hour + ":" + minute))
        })

        setFormatedTime(time)
    }

    const handleClick = () => {
        console.log(jadwal);
    }

    const renderList = jadwal.map((value) => (
        <Grid item sm={1} md={1} key={value.key}>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Kegiatan: {value.kegiatan}<br />
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 'medium' }}>
                        Tanggal: {value.tanggal}<br />
                        Pukul: {value.pukul}<br />
                        Hari: {value.hari}<br />
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'end' }}>
                    <Button size="small" >Delete</Button>
                    <Button size="small" component={Link} to={"/jadwal/detail?id=" + value.key.trim()}>Pilih</Button>
                </CardActions>
            </Card>
        </Grid>
    ))

    return (
        <Box component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
            <Toolbar />
            <CssBaseline />
            <Container maxWidth="md">
                {renderList}
                <Button onClick={handleClick}>Log</Button>
            </Container>

        </Box>
    )
}