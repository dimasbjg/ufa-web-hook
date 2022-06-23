import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { Button } from "@mui/material";

import { signOut } from "firebase/auth"
import { auth } from "../firebase.js";

import { useNavigate } from "react-router-dom"

export default function Home() {
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
                            navigate('/account')
                        }}>Kelola akun pelanggan</Button>
                    <br /> <br />
                    <Button fullWidth
                        variant="contained"
                        onClick={() => {
                            navigate('/jadwal')
                        }}>Kelola jadwal</Button>
                    <br /> <br />
                    <Button fullWidth
                        variant="contained"
                        onClick={() => {

                        }}>Kelola peminjaman barang</Button>
                    <br /> <br />
                    <Button fullWidth
                        variant="contained"
                        onClick={() => {

                        }}>Kelola informasi seputar umroh</Button>
                    <br /> <br />
                    <Button fullWidth
                        variant="contained"
                        onClick={() => {
                            signOut(auth)
                                .then(() => navigate('/'))
                                .catch((err) => alert(err.message))
                        }}>Logout</Button>
                </Container>
            </Box>
        </div>
    )
}