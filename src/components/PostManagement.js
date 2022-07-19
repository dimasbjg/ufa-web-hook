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

function ReadMore({ children }) {
    const text = children;

    const [isTruncated, setIsTruncated] = useState(true);

    const resultString = isTruncated ? text.slice(0, 100) + "..." : text;

    function toggleIsTruncated() {
        setIsTruncated(!isTruncated)
    }

    return (
        <Typography align='justify' sx={{ fontSize: 14, fontWeight: 'small' }}>
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
    const [add, setAdd] = useState(false);
    const [articles, setArticles] = useState([]);
    const [time, setTime] = useState();
    const [judul, setJudul] = useState();
    const [isi, setIsi] = useState();
    const [tempJudul, setTempJudul] = useState();
    const [tempIsi, setTempIsi] = useState();

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
                tempArticles.push({
                    'key': childSnapshot.key,
                    'judul': childSnapshot.val().judul,
                    'isi': childSnapshot.val().isi,
                    'timestamp': childSnapshot.val().timestamp
                });
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
    const handleClickDeleteDialog = id => {
        setDeleteId(id);
    }

    const handleClickEditDialog = id => {
        setTempJudul(id.judul);
        setTempIsi(id.isi);
        setEditId(id);
    }

    const handleAddDialog = () => {
        var currentTimeInMilliseconds = Date.now(); // unix timestamp in milliseconds
        setTime(currentTimeInMilliseconds);
        setAdd(true);
    }


    //all close dialog
    const handleCloseDeleteDialog = () => {
        setDeleteId(false);
    }

    const handleCloseEditDialog = () => {
        setEditId(false)
    }

    const handleCloseAddDialog = () => {
        setAdd(false);
    }

    //handle database
    //delete
    const handleDelete = key => {
        remove(ref(db, '/informasi/' + key))
        setDeleteId(false);
    }

    //insert
    const handleAdd = () => {
        if (judul === '' || judul === null || judul === undefined) {
            alert('Judul tidak boleh kosong');
            return;
        }

        if (isi === '' || isi === null || isi === undefined) {
            alert('Konten artikel tidak boleh berisi informasi kosong');
            return;
        }



        let postRef = ref(db, '/informasi');
        const newPostRef = push(postRef);

        set(ref(db, '/informasi/' + newPostRef.key), {
            judul: judul,
            isi: isi,
            timestamp: time
        }).then(() => alert("Berhasil membuat postingan baru")).catch((err) => alert(err.message));
        setAdd(false);
        setJudul();
        setIsi();

    }

    const handleUpdate = (value) => {
        update(ref(db,'/informasi/' + value.key), {
            judul: tempJudul,
            isi: tempIsi,
            timestamp: value.timestamp
        }).then(() => alert("Update berhasil~~!!!")).catch((err) => alert(err.message));
        setTempJudul();
        setTempIsi();
        setEditId(false);
    }



    const renderList = articles.map((value, index) => (
        <Grid item sm={1} md={1} key={value.key}>
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
                    <Dialog open={deleteId === value} onClose={handleCloseDeleteDialog}>
                        <DialogContent>
                            <DialogTitle>
                                {/* Title */}
                                Hapus artikel berikut?
                            </DialogTitle>
                            <DialogContentText>
                                {/* Content */}
                                Hapus artikel dengan judul {value.judul} <br />
                                Artikel yang telah dihapus tidak dapat dikembalikan kembali !!!
                            </DialogContentText>
                            <DialogActions>
                                {/* Action */}
                                <Button onClick={handleCloseDeleteDialog}>Batal</Button>
                                <Button onClick={() => handleDelete(value.key)}>Hapus</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>

                    {/* Dialog Edit */}
                    <Dialog open={editId === value} onClose={handleCloseEditDialog}>
                        <DialogContent>
                            <DialogTitle>
                                {/* Title */}
                                Edit artikel berikut? {value.judul}
                            </DialogTitle>
                            <DialogContentText>
                                {/* Content */}
                            </DialogContentText>
                            <TextField
                                autoFocus
                                multiline
                                rows={2}
                                margin="dense"
                                id="judul"
                                label="Judul"
                                value={tempJudul}
                                onChange={(e) => setTempJudul(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                            <br />
                            <TextField
                                autoFocus
                                multiline
                                rows={4}
                                margin="dense"
                                id="isi"
                                label="Isi"
                                value={tempIsi}
                                onChange={(e) => setTempIsi(e.target.value)}
                                fullWidth
                                variant="outlined" />
                            <DialogActions>
                                {/* Action */}
                                <Button onClick={handleCloseEditDialog}>Batal</Button>
                                <Button onClick={() => handleUpdate(value)}>Simpan</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>

                </CardContent>
                <CardActions sx={{ justifyContent: 'end' }}>
                    <Button size="small"
                        onClick={() => handleClickDeleteDialog(value)}
                    >Hapus</Button>
                    <Button size="small"
                        onClick={() => handleClickEditDialog(value)}
                    >Ubah</Button>
                </CardActions>
            </Card>
            <br />
        </Grid>
    ))

    return (
        <Box component='main' sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
            <Container maxWidth="md">
                <Button onClick={handleAddDialog} variant="outlined">Posting artikel baru</Button> <br /> <br />
                {renderList}

                {/* Dialog Add */}
                <Dialog open={add} onClose={handleCloseAddDialog}>
                    <DialogContent>
                        <DialogTitle>
                            Posting artikel baru untuk informasi pengguna
                        </DialogTitle>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            multiline
                            rows={2}
                            margin="dense"
                            id="judul"
                            label="Judul"
                            onChange={(e) => setJudul(e.target.value)}
                            fullWidth
                            variant="outlined" />
                        <br />
                        <TextField
                            autoFocus
                            multiline
                            rows={4}
                            margin="dense"
                            id="isi"
                            label="Isi"
                            onChange={(e) => setIsi(e.target.value)}
                            fullWidth
                            variant="outlined" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDialog}>Batal</Button>
                        <Button onClick={handleAdd}>OK</Button>
                    </DialogActions>
                </Dialog>
                <Button onClick={handleTimeStamp}>get Time</Button>
                <Button onClick={() => console.log(articles)}>Check</Button>
            </Container>
        </Box>
    )
}