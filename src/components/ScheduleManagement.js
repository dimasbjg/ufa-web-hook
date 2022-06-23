import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { Button, Grid } from "@mui/material";
import { auth, db } from "../firebase.js";
import { ref, onValue, set } from "firebase/database";

import { useNavigate, Link } from "react-router-dom"

export default function ScheduleManagement() {
    const navigate = useNavigate();
    const [kloter, setKloter] = useState([]);
    const [letRun, setLetRun] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/');
            }
        })
    });

    useEffect(() => {
        if (letRun) {
            onValue(ref(db, 'kloter'), snapshot => {
                let listKloter = [];
                snapshot.forEach(childSnapshot => {
                    let keyNumber = childSnapshot.key;
                    listKloter.push({ "key": keyNumber })
                });
                setKloter(listKloter);
                setLetRun(false);
            })
        }
    });

    const addNewKloter = () => {
        let last = kloter[kloter.length - 1]
        // console.log(parseInt(last.key) + 1)
        set(ref(db, "kloter/" + (parseInt(last.key) + 1)), {
            kegiatan: false
        })
        
    }

    const renderButton = kloter.map(value => (
        <Grid item sm={1} md={1} key={value.key}>
            <Button fullWidth
                variant="contained"
                component={Link} to={"/jadwal/kloter?id=" + value.key.trim()}>
                Kloter {value.key}
            </Button>
            <br />
            <br />
        </Grid>
    ))


    return (
        <Box component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
            <Toolbar />
            <CssBaseline />
            <Container maxWidth="md">
                <h1>Kelola Jadwal</h1>
                {renderButton}
                <Button onClick={addNewKloter}>Tambah Kloter Baru</Button>
            </Container>
        </Box>
    )
}