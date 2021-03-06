import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { Button } from "@mui/material";

import { auth } from "../firebase.js";

import { useNavigate } from "react-router-dom"

export default function AccountManagement() {
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/')
            }
        })
    })

    return (
        <div>
            <Box component="main"
                sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
                <Toolbar />
                <CssBaseline />
                <Container maxWidth="md">
                    <Button fullWidth
                        variant="contained"
                        onClick={() => {
                            navigate('/account/request')
                        }}>Ubah data pelanggan</Button>
                    <br /> <br />
                    <Button fullWidth
                        variant="contained"
                        onClick={() => {
                            navigate('/account/create')
                        }}>Buat akun baru untuk pelanggan</Button>
                    <br /> <br />
                </Container>
            </Box>
        </div>
    )
}