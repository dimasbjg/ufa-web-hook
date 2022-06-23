import './App.css';
import Login from "./components/Login";
import Home from "./components/Home";
import AccountManagement from './components/AccountManagement';
import CreateAccount from './components/CreateAccount';
import ChangeRequest from './components/ChangeRequest';
import FormChange from './components/FormChange';
import ScheduleManagement from './components/ScheduleManagement';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<AccountManagement />} />
          <Route path="/account/create" element={<CreateAccount />} />
          <Route path="/account/request" element={<ChangeRequest />} />
          <Route path="/account/change" element={<FormChange />} />
          <Route path="/jadwal" element={<ScheduleManagement />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;