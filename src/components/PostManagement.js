import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Button, DialogTitle, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { auth, db } from "../firebase.js";
import { ref, onValue, update, orderByChild, query, push, set, remove } from "firebase/database";

import { useNavigate, useSearchParams } from "react-router-dom";

function ReadMore({ children, maxCharacterCount = 100 }) {
    const text = children;

    const [isTruncated, setIsTruncated] = useState(true);

    const resultString = isTruncated ? text.slice(0, 100) + "..." : text;

    function toggleIsTruncated() {
        setIsTruncated(!isTruncated)
    }

    return (
        <Typography align='justify' sx={{ fontSize: 14, fontWeight: 'medium' }}>
            {resultString}
            <Button size="small" onClick={toggleIsTruncated}>
                {isTruncated ? "Baca lebih lengkap" : "Ciutkan"}
            </Button>
        </Typography>
    )
}

export default function PostManagement() {
    const navigate = useNavigate();
    const [editId, setEditId] = useState(0);
    const [deleteId, setDeleteId] = useState(0);
    const [addId, setAddId] = useState(false);
    const [articles, setArticles] = useState([]);
    const [time, setTime] = useState();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/');
            }
        })
    });

    useEffect(() => {
        let postRef = query(ref(db, '/informasi/'), orderByChild('timestamp'))
        onValue(postRef, snapshot => {

            let tempArticles = [];

            snapshot.forEach(childSnapshot => {
                tempArticles.push(childSnapshot.val());
            });

            tempArticles.reverse();

            setArticles(tempArticles);
        })
    }, [])

    const handleTimeStamp = () => {
        var currentTimeInMilliseconds = Date.now(); // unix timestamp in milliseconds
        setTime(currentTimeInMilliseconds);
    }

    //all open dialog
    const handleClickDeleteId = id => {
        setDeleteId(id);
    }

    const handleClickEditId = id => {
        setEditId(id);
    }


    //all close dialog
    const handleCloseDelete = () => {
        setDeleteId(false);
    }

    const handleCloseEdit = () => {
        setEditId(false)
    }


    const renderList = articles.map((value, index) => (
        <Grid item sm={1} md={1} key={index}>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {value.judul}
                    </Typography>
                    <ReadMore>
                        {value.isi}
                    </ReadMore>

                    {/* Dialog */}
                    {/* Dialog Delete */}
                    <Dialog open={deleteId === value} onClose={handleCloseDelete}>
                        <DialogContent>
                            <DialogTitle>
                                {/* Title */}
                                Hapus artikel berikut? {value.judul}
                            </DialogTitle>
                            <DialogContentText>
                                {/* Content */}
                            </DialogContentText>
                            <DialogActions>
                                {/* Action */}
                                <Button onClick={handleCloseDelete}>Batal</Button>
                                <Button onClick={handleCloseDelete}>Hapus</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>

                    {/* Dialog Edit */}
                    <Dialog open={editId === value} onClose={handleCloseEdit}>
                        <DialogContent>
                            <DialogTitle>
                                {/* Title */}
                                Edit artikel berikut? {value.judul}
                            </DialogTitle>
                            <DialogContentText>
                                {/* Content */}
                            </DialogContentText>
                            <DialogActions>
                                {/* Action */}
                                <Button onClick={handleCloseEdit}>Batal</Button>
                                <Button onClick={handleCloseEdit}>Simpan</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>

                </CardContent>
                <CardActions sx={{ justifyContent: 'end' }}>
                    <Button size="small"
                        onClick={() => handleClickDeleteId(value)}
                    >Hapus</Button>
                    <Button size="small"
                        onClick={() => handleClickEditId(value)}
                    >Ubah</Button>
                </CardActions>
            </Card>
            <br />
        </Grid>
    ))

    return (
        <Box component='main' sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
            <Container maxWidth="md">
                {renderList}
                <Button onClick={handleTimeStamp}>get Time</Button>
                <Button onClick={() => console.log(articles)}>Check</Button>
            </Container>
        </Box>
    )
}