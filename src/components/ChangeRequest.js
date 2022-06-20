import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from "@mui/system";
import { Toolbar, Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom';

import { db } from '../firebase.js';
import { ref, onValue } from "firebase/database";

export default function ChangeRequest() {
    const [perubahanList, setPerubahanList] = useState([]);

    useEffect(() => {
        onValue(ref(db, 'perubahan'), snapshot => {
            const data = snapshot.val();
            var dataList = [];

            for (let uid in data) {
                dataList.push(data[uid])
            }
            setPerubahanList(dataList)

        })
    }, []);

    const renderList = perubahanList.map(value => (
        <Grid item sm={1} md={1} key={value.uid}>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Kategori perubahan: {value.kategori}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 'medium' }}>
                        {value.detail}
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'end' }}>
                    <Button size="small" component={Link} to={"/account/change?uid=" + value.uid.trim()}>Pilih</Button>
                </CardActions>
            </Card>
            <br />
        </Grid>
    ))

    return (
        <Box component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            <Toolbar />
            <CssBaseline />
            <Container maxWidth="md">
                {renderList}
            </Container>
        </Box>
    )
}