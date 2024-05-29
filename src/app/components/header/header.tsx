import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import ReactDOM from 'react-dom';
import LoginPage from "../../screen/auth/login/login.tsx";
import Home from "../../screen/home/home.tsx";
import Clinics from "../../screen/clinics/clinics.tsx";
import Contact from "../../screen/contact/contact.tsx";
import MapPage from "../../map/hotels.tsx";
import './header.css';
import OffersPage from "../../screen/offer/offers.tsx";

const routes = createRoutesFromElements(
  <Route path="/" element={<Home />}>
    <Route path="../auth/login/login.tsx" element={<LoginPage />} />
    <Route path="../../screen/clinics/clinics.tsx" element={<Clinics/>} />
    <Route path="../../map/hotels.tsx" element={<MapPage/>} />
    <Route path="../../screen/contact/contact.tsx" element= {<Contact/>} />
    <Route path="../../screen/offer/offers.tsx" element={<OffersPage/>} />
  </Route>
);

// Creating router
const router = createBrowserRouter(routes);

export function Header() {
  const location = useLocation();

  // Determine whether to hide the header based on the current route
  const hideHeader = location.pathname === "/admin" || location.pathname === "/superAdmin";

  if (hideHeader) {
    return null; // Return null to hide the header
  }
    return (
      <header className="Header">
      <nav className="navbar">
        <div className="left-links">
        <img src={'./softwareLogo.png'} alt="Logo" className="logo" style={{background: 'transparent'}} />
            <a href="/">Home</a>
            <a href="/clinics">Clinics</a>
            <a href="/hotels">Hotels</a>
            <a href="/contact">Contact</a>
            <a href="/offers">Offers</a>
        </div>
          <div className="right-links">
            <a href="/login" className="login-button" >Login</a> 
        </div>
      </nav>
    </header>
    );
  }
  ReactDOM.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
    document.getElementById('root')
  );