import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { auth, db } from "../firebase.js";
import { ref, onValue, update, orderByChild, query, push, set, remove } from "firebase/database";

import { useNavigate, useSearchParams } from "react-router-dom";

export default function SceduleList() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [jadwal, setJadwal] = useState([]);
    const [searchParams] = useSearchParams();
    const [openId, setOpenId] = useState(0);
    const [deleteId, setDeleteId] = useState(0);
    const [date, setDate] = useState(new Date());
    const [editKegiatan, setEditKegiatan] = useState();


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/');
            }
        })
    });

    useEffect(() => {
        let refJadwal = query(ref(db, 'kloter/' + searchParams.get('id')),  ('tanggal'))
        onValue(refJadwal, snapshot => {
            var dataList = [];

            snapshot.forEach(childSnapshot => {
                let key = childSnapshot.key;
                let dataString = '' + childSnapshot.val().pukul;
                let minute = dataString.slice(-2);
                let hour = dataString.substring(0, dataString.length - 2);
                if (hour.length === 1) {
                    hour = "0" + hour
                }
                let time = (hour + ":" + minute);
                let tanggalString = '' + childSnapshot.val().tanggal;
                let year = tanggalString.substring(0, 4);
                let month = tanggalString.substring(4, 6);
                let date = tanggalString.substring(6, 8);
                switch (Number(month) - 1) {
                    case 0: month = "Januari"; break;
                    case 1: month = "Februari"; break;
                    case 2: month = "Maret"; break;
                    case 3: month = "April"; break;
                    case 4: month = "Mei"; break;
                    case 5: month = "Juni"; break;
                    case 6: month = "Juli"; break;
                    case 7: month = "Agustus"; break;
                    case 8: month = "September"; break;
                    case 9: month = "Oktober"; break;
                    case 10: month = "November"; break;
                    case 11: month = "Desember"; break;
                    default: month = "Januari"; break;
                }
                let tanggal = date + " " + month + " " + year
                dataList.push({
                    "key": key,
                    "kegiatan": childSnapshot.val().kegiatan,
                    "hari": childSnapshot.val().hari,
                    "tanggal": tanggal,
                    "pukul": time
                })
            })
            setJadwal(dataList);
        })
    }, [searchParams]);

    const handleUpdate = (key, kegiatan, dateParam, index) => {
        if (kegiatan === '' || kegiatan === undefined || kegiatan === null) {
            alert("Nama kegiatan tidak boleh kosong")
            return;
        };
        

        let tempJadwal = jadwal;
        let itemJadwal = tempJadwal[index];
        itemJadwal.kegiatan = kegiatan;
        let formatedDate = ((dateParam.getFullYear()) * 10000) +
            ((dateParam.getMonth() + 1) * 100) +
            (dateParam.getDate());
        let hari = dateParam.getDay()
        switch (hari) {
            case 0: hari = "Minggu"; break;
            case 1: hari = "Senin"; break;
            case 2: hari = "Selasa"; break;
            case 3: hari = "Rabu"; break;
            case 4: hari = "Kamis"; break;
            case 5: hari = "Jum'at"; break;
            case 6: hari = "Sabtu"; break;
            default: hari = "Minggu"; break;
        }
        let time = ((dateParam.getHours() * 100) + dateParam.getMinutes())
        itemJadwal.tanggal = formatedDate;
        itemJadwal.pukul = time;
        itemJadwal.hari = hari;
        console.log(itemJadwal);

        //update here
        update(ref(db, '/kloter/' + searchParams.get('id') + '/' + key), {
            kegiatan: itemJadwal.kegiatan,
            tanggal: itemJadwal.tanggal,
            pukul: time,
            hari: itemJadwal.hari
        }).catch((err) => {
            alert(err.message);
            return;
        })

        setEditKegiatan("");
        setOpenId(false);
    }

    const handleAdd = (kegiatan, dateParam) => {
        let formatedDate = ((dateParam.getFullYear()) * 10000) +
            ((dateParam.getMonth() + 1) * 100) +
            (dateParam.getDate());
        let hari = dateParam.getDay()
        switch (hari) {
            case 0: hari = "Minggu"; break;
            case 1: hari = "Senin"; break;
            case 2: hari = "Selasa"; break;
            case 3: hari = "Rabu"; break;
            case 4: hari = "Kamis"; break;
            case 5: hari = "Jum'at"; break;
            case 6: hari = "Sabtu"; break;
            default: hari = "Minggu"; break;
        }
        let time = ((dateParam.getHours() * 100) + dateParam.getMinutes());

        const postRef = ref(db, '/coba')
        const newPostRef = push(postRef);

        set(ref(db, '/kloter/' + searchParams.get('id') + '/' + newPostRef.key), {
            kegiatan: kegiatan,
            tanggal: formatedDate,
            hari: hari,
            pukul: time
        }).then(() => alert("Data berhasil ditambahkan")).catch((err) => alert(err.message));
        setOpen(false)

    }

    const handleDelete = (key) => {
        remove(ref(db, '/kloter/' + searchParams.get('id') + '/' + key))
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleClickOpenId = id => {
        setOpenId(id);
    };

    const handleClickCloseId = () => {
        setOpenId(false);
    };

    const handleClickDeleteId = id => {
        setDeleteId(id);
    };

    const handleClickCloseDeleteId = () => {
        setDeleteId(false);
    };

    const renderList = jadwal.map((value, index) => (
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
                    <Dialog open={deleteId === value} onClose={handleClickCloseDeleteId}>
                        <DialogContent>
                            <DialogTitle>
                                Hapus jadwal berikut?
                            </DialogTitle>
                            <DialogContentText>
                                Kegiatan: {value.kegiatan}<br />
                                Tanggal: {value.tanggal}<br />
                                Pukul: {value.pukul}<br />
                                Hari: {value.hari}<br />
                                Apakah Anda yakin untuk menghapus jadwal berikut?<br />
                                Jadwal yang sudah terhapus tidak dapat dikembalikan lagi dan harus mengisi ulang untuk mengembalikan jadwal yang telah dihapus
                            </DialogContentText>
                            <DialogActions>
                                <Button onClick={handleClickCloseDeleteId}>Batal</Button>
                                <Button onClick={() => handleDelete(value.key)}>Hapus</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={openId === value} onClose={handleClickCloseId}>
                        <DialogContent>
                            <DialogContentText>
                                Apakah Anda ingin merubah data berikut<br />
                                Kegiatan: {value.kegiatan}<br />
                                Tanggal: {value.tanggal}<br />
                                Pukul: {value.pukul}<br />
                                Hari: {value.hari}<br />
                            </DialogContentText>
                            <TextField
                                multiline
                                rows={4}
                                autoFocus
                                margin="dense"
                                id="kegiatan"
                                label="Kegiatan"
                                onChange={(e) => setEditKegiatan(e.target.value)}
                                fullWidth
                                variant="outlined"
                            /> <br /> <br />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Tanggal dan Waktu"
                                    value={date}
                                    inputFormat="dd/MM/yyyy HH:mm"
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                />
                            </LocalizationProvider>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClickCloseId}>Batal</Button>
                            <Button onClick={() => {
                                handleUpdate(value.key, editKegiatan, date, index)
                            }}>OK</Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
                <CardActions sx={{ justifyContent: 'end' }}>
                    <Button size="small"
                        onClick={() => handleClickDeleteId(value)}
                    >Hapus</Button>
                    <Button size="small"
                        onClick={() => handleClickOpenId(value)}
                    >Ubah</Button>
                </CardActions>
            </Card> <br />
        </Grid >
    ))

    return (
        <Box component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default" }}>
            <CssBaseline />
            <br />
            <br />
            <Container maxWidth="md">
                <Button onClick={handleOpen} variant="outlined">Tambah Jadwal</Button>
                {renderList}
                <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                        <DialogTitle>
                            Buat Jadwal baru
                        </DialogTitle>
                        <DialogContentText>
                            Harap isi detail jadwal yang akan dibuat! <br />
                        </DialogContentText>
                        <TextField
                            autoFocus
                            multiline
                            rows={4}
                            margin="dense"
                            id="kegiatan"
                            label="Kegiatan"
                            onChange={(e) => setEditKegiatan(e.target.value)}
                            fullWidth
                            variant="outlined"
                        /> <br /> <br />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} />}
                                label="Tanggal dan Waktu"
                                value={date}
                                inputFormat="dd/MM/yyyy HH:mm"
                                onChange={(newValue) => {
                                    setDate(newValue);
                                }}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Batal</Button>
                        <Button onClick={() => {
                            handleAdd(editKegiatan, date)
                        }}>OK</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box >
    )
}