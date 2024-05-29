import React from 'react';
import Home from './app/screen/home/home.tsx';
import LoginPage from './app/screen/auth/login/login.tsx';
import Clinics from './app/screen/clinics/clinics.tsx';
import Contact from './app/screen/contact/contact.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ReactDOM from 'react-dom';
import { Header } from './app/components/header/header.tsx';
import MapPage from './app/map/hotels.tsx';
import AdminHome  from './app/admin/home/adminHomePage.tsx';
import SuperAdmin from './app/superAdmin/superAdmin.tsx';
import { AuthProvider } from './app/context/AuthContext.tsx';
import OffersPage from './app/screen/offer/offers.tsx';
import CreateClinic from './app/superAdmin/components/createClinic.tsx';
import './App.css'; 
import { UserProvider } from './app/context/UserContext.tsx';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
    <Router>
      <Header/>
      <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/clinics' element={<Clinics/>} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/hotels' element={<MapPage/>} />
        <Route path='/admin' element={<AdminHome/>}/>
        <Route path='/superAdmin' element={<SuperAdmin/>} />
        <Route path='/offers' element={<OffersPage/>} />
        <Route path="/create-clinic" element={<CreateClinic/>} />
      </Routes>
    </Router>
    </UserProvider>
    </AuthProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);