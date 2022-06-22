import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, Toolbar, TextField, FormControl, RadioGroup, FormLabel, Radio, FormControlLabel, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { auth, db } from "../firebase.js";
import { ref, onValue, update, remove } from "firebase/database";

import { useNavigate, useSearchParams } from "react-router-dom";

export default function FormChange() {

    const [nama, setNama] = useState("");
    const [nik, setNik] = useState("");
    const [nokk, setNokk] = useState("");
    const [kewarganegaraan, setKewarganegaraan] = useState("");
    const [kloter, setKloter] = useState(0);
    const [tempatLahir, setTempatLahir] = useState("");
    const [date, setDate] = useState(null);
    const [formatedDate, setFormatedData] = useState(null);
    const [umur, setUmur] = useState(0);
    const [ayah, setAyah] = useState("");
    const [ibu, setIbu] = useState("");
    const [alamat, setAlamat] = useState("");
    const [kelamin, setKelamin] = useState(true);
    const [menikah, setMenikah] = useState(true);

    const [loopremove, setloopremove] = useState("loopremove");
    const [searchParams] = useSearchParams();
    const [detail, setDetail] = useState("");

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleChangeKelamin = (e) => {
        var isKelamin = (e.target.value === "true")
        setKelamin(isKelamin);
    };

    const handleChangeMenikah = (e) => {
        var isMenikah = (e.target.value === "true")
        setMenikah(isMenikah);
    };

    const deletePerubahanPermintaan = () => {
        remove(ref(db, "perubahan/" + searchParams.get('uid')));
    };

    const handleUpdate = () => {
        update(ref(db, "Users/" + searchParams.get('uid')), {
            alamat: alamat,
            kelamin: kelamin,
            kewarganegaraan: kewarganegaraan,
            kloter: kloter,
            nama: nama,
            nik: Number(nik),
            nokk: Number(nokk),
            pengajuanPerubahan: false,
            requestverify: false,
            menikah: menikah,
            orangtua1: ayah,
            orangtua2: ibu,
            tanggallahir: formatedDate,
            tempatlahir: tempatLahir,
            umur: Number(umur),
            verified: false
        });
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/');
            }
        });

        if (loopremove === "loopremove") {
            onValue(ref(db, "perubahan/" + searchParams.get('uid')), snapshot => {
                setDetail(snapshot.val().detail);

            })
            onValue(ref(db, "Users/" + searchParams.get('uid')), snapshot => {
                const data = snapshot.val();
                setAlamat(data.alamat);
                setNama(data.nama);
                setAyah(data.orangtua1);
                setKelamin(data.kelamin);
                setKewarganegaraan(data.kewarganegaraan);
                setNik(data.nik);
                setNokk(data.nokk);
                setKloter(data.kloter);
                setMenikah(data.menikah);
                setIbu(data.orangtua2);
                setTempatLahir(data.tempatlahir);
                setUmur(data.umur);
                const year = ('' + data.tanggallahir).substring(0, 4);
                const month = ('' + data.tanggallahir).substring(4, 6);
                const day = ('' + data.tanggallahir).substring(6, 8);
                setDate(new Date(year, month - 1, day));
                setloopremove("notloopanymore");
            });
        }
    });

    return (
        < Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }
            }
        >

            <Toolbar />
            <CssBaseline />
            <Container maxWidth="md">
                <Typography variant="h1" component="div" fontSize={40}>
                    <bold>Ubah data akun pelanggan dengan id: </bold>{searchParams.get('uid')}
                </Typography>
                <br />
                <Typography variant="body2" component="div">
                    Dengan detail perubahan: <br /> {detail}
                </Typography>
                <br /><br />
                <TextField
                    fullWidth
                    id="nama-field"
                    label="Nama"
                    value={nama}
                    onChange={(e) => {
                        setNama(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="nik-field"
                    label="NIK"
                    value={nik}
                    onChange={(e) => {
                        setNik(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="nokk-field"
                    label="No Kartu Keluarga"
                    value={nokk}
                    onChange={(e) => {
                        setNokk(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="kewarganegaraan-field"
                    label="Kewarganegaraan"
                    value={kewarganegaraan}
                    onChange={(e) => {
                        setKewarganegaraan(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="kloter-field"
                    label="Kloter"
                    type="number"
                    value={kloter}
                    onChange={(e) => {
                        setKloter(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="tempat-lahir-field"
                    label="Tempat Lahir"
                    value={tempatLahir}
                    onChange={(e) => {
                        setTempatLahir(e.target.value)
                    }}
                />
                <br /><br />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        fullWidth
                        wrapperClassName="datepicker"
                        label="Tanggal lahir"
                        renderInput={(params) => <TextField{...params} />}
                        value={date}
                        onChange={(newValue) => {
                            setDate(newValue)
                            setFormatedData(
                                ((newValue.getFullYear()) * 10000) +
                                ((newValue.getMonth() + 1) * 100) +
                                (newValue.getDate())
                            )
                        }}
                    >

                    </DatePicker>
                </LocalizationProvider>
                <br /><br />
                <TextField
                    fullWidth
                    id="umur-field"
                    label="Umur"
                    type="number"
                    value={umur}
                    onChange={(e) => {
                        setUmur(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="ayah-field"
                    label="Nama Ayah"
                    value={ayah}
                    onChange={(e) => {
                        setAyah(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="ibu-field"
                    value={ibu}
                    label="Nama Ibu"
                    onChange={(e) => {
                        setIbu(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="alamat-field"
                    label="Alamat"
                    multiline
                    rows={4}
                    value={alamat}
                    onChange={(e) => { setAlamat(e.target.value) }}
                />
                <br /><br />
                <FormControl>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <RadioGroup
                        row
                        value={kelamin}
                        onChange={handleChangeKelamin}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Laki - Laki" />
                        <FormControlLabel value="false" control={<Radio />} label="Perempuan" />
                    </RadioGroup>
                </FormControl>
                <br />
                <FormControl>
                    <FormLabel>Status Menikah</FormLabel>
                    <RadioGroup
                        row
                        value={menikah}
                        onChange={handleChangeMenikah}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Sudah menikah" />
                        <FormControlLabel value="false" control={<Radio />} label="Belom menikah" />
                    </RadioGroup>
                </FormControl>
                <br />
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleOpen}>
                    Update Akun Pelanggan</Button>
                <br />
                <br />
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Konfirmasi update"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Apakah semua data sudah dimasukkan dengan benar? Pastikan semua data yang perlu diperbaharui sudah diisi dengan benar
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Belom</Button>
                        <Button onClick={() => {
                            handleUpdate();
                            deletePerubahanPermintaan();
                            handleClose();
                        }} autoFocus>Sudah</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box >

    )

}