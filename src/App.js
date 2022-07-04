import './App.css';
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import AccountManagement from './components/AccountManagement';
import CreateAccount from './components/CreateAccount';
import ChangeRequest from './components/ChangeRequest';
import FormChange from './components/FormChange';
import ScheduleManagement from './components/ScheduleManagement';
import ScheduleList from './components/ScheduleList';

import IconButton from '@mui/material/IconButton';
import Home from '@mui/icons-material/Home';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';


import {
  BrowserRouter as Router,
  Routes,
  Route, Link
} from "react-router-dom"

function App() {
  return (
    <div>
      <Router>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="home" sx={{ mr: 2 }} component={Link} to="/">
              <Home />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Umroh Farfasa Apps
            </Typography>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/account" element={<AccountManagement />} />
          <Route path="/account/create" element={<CreateAccount />} />
          <Route path="/account/request" element={<ChangeRequest />} />
          <Route path="/account/change" element={<FormChange />} />
          <Route path="/jadwal" element={<ScheduleManagement />} />
          <Route path='/jadwal/kloter' element={<ScheduleList />} />
        </Routes>


      </Router>
    </div>
  );
}

export default App;