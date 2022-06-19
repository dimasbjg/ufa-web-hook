import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { TextField, Button } from "@mui/material";

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase.js";

import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user) {
                navigate('/home')
            }
        })
    })

    return (
        <div>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
                <Toolbar />
                <CssBaseline />
                <Container maxWidth="md">
                    <h1>Login</h1>
                    <TextField
                        fullWidth
                        id='email-login'
                        variant='outlined'
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <br /><br />
                    <TextField
                        fullWidth
                        id='password-login'
                        variant='outlined'
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <br /><br />
                    <Button fullWidth
                        variant="contained"
                        onClick={(e) =>
                            signInWithEmailAndPassword(auth, email, password)
                                .then(() => { navigate('/home') })
                                .catch((err) => alert(err.message))
                        }>

                        Login
                    </Button>
                </Container>
            </Box>
        </div>
    )
}