import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from "@mui/system";
import { DatePicker } from "@mui/lab";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, Toolbar, TextField, FormControl, RadioGroup, FormLabel, Radio, FormControlLabel } from "@mui/material";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { set, ref } from "firebase/database";

import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nama, setNama] = useState("");
    const [nik, setNik] = useState("");
    const [nokk, setNokk] = useState("");
    const [kewarganegaraan, setKewarganegaraan] = useState("");
    const [kloter, setKloter] = useState(null);
    const [tempatLahir, setTempatLahir] = useState("");
    const [date, setDate] = useState(null);
    const [formatedDate, setFormatedData] = useState(null);
    const [umur, setUmur] = useState(null);
    const [ayah, setAyah] = useState("");
    const [ibu, setIbu] = useState("");
    const [alamat, setAlamat] = useState("");
    const [kelamin, setKelamin] = useState(true);
    const [menikah, setMenikah] = useState(true)

    const navigate = useNavigate();

    const handleChangeKelamin = (e) => {
        var isKelamin = (e.target.value === "true")
        setKelamin(isKelamin);
    };

    const handleChangeMenikah = (e) => {
        var isMenikah = (e.target.value === "true")
        setMenikah(isMenikah)
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/')
            }
        })
    })

    return (

        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
            <Toolbar />
            <CssBaseline />
            <Container maxWidth="md">
                <h1>Buat akun untuk pelanggan</h1>
                <TextField
                    fullWidth
                    id="email-field"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="password-field"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <br /><br />
                <TextField
                    fullWidth
                    id="password-confirmation-field"
                    label="Konfirmasi Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value)
                    }}
                />
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
                    onClick={() => {
                        // check field
                        if (password !== confirmPassword) {
                            console.log(password)
                            console.log(confirmPassword)
                            alert("Konfirmasi password tidak sama dengan Password")
                            return
                        }
                        //register
                        createUserWithEmailAndPassword(auth, email, password).then(
                            (result) => {
                                //insert data
                                set(ref(db, '/Users/' + result._tokenResponse.localId), {
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
                                })
                                alert("Akun Berhasil dibuat")
                                navigate("/account")
                            }
                        ).catch((err) => alert(err.message))
                    }
                    }>
                    Daftarkan Akun Pelanggan</Button>
                <br />
                <br />
                <Button
                    onClick={() => { alert(menikah) }}
                >Check Value</Button>
            </Container>
        </Box>

    )

}