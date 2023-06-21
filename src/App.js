import React, {useCallback, useEffect, useState} from 'react';
import CountrySelector from './components/CountrySelector';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterPage from "./components/RegisterPage";
import Logout from "./components/Logout";
import jwtDecode from "jwt-decode";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";


function App() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedHub, setSelectedHub] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = () => {
        const token = localStorage.getItem('jwt');

        if (token) {
            const decodedToken = jwtDecode(token);

            if (decodedToken.exp < Date.now() / 1000) {
                // Token wygasł
                setIsLoggedIn(false);
            } else {
                // Token jest ważny
                setIsLoggedIn(true);
            }
        } else {
            // Brak tokena
            setIsLoggedIn(false);
        }
    };

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
    }, [setIsLoggedIn]);

    const handleLogin = useCallback(() => {
        setIsLoggedIn(true);
    }, [setIsLoggedIn]);


    return (
        <Router>
            <Routes>
                <Route path="/logout" element={<Logout onLogout={handleLogout}/>}/>
                <Route path="/login" element={<LoginPage onLogin={handleLogin}/>}/>
                <Route path="/register" element={<RegisterPage onRegistration={handleLogin}/>}/>
                {/*<Route path="/breweries" element={<BreweriesPage/>}/>*/}
                <Route path="/" element={isLoggedIn ?                     <>
                    <NavBar/>
                    <CountrySelector onCountrySelect={setSelectedCountry}/>
                </> : <HomePage/>}/>

                <Route path="/countries" element={
                    <>
                    <NavBar/>
                    <CountrySelector onCountrySelect={setSelectedCountry}/>
                </>
                }/>
            </Routes>
        </Router>
    );


}


export default App;
