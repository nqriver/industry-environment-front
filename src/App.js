import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterPage from "./components/RegisterPage";
import Logout from "./components/Logout";
import jwtDecode from "jwt-decode";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import ChartPage from "./components/ChartPage";
import CountryList from "./components/CountryList";
import UserPage from "./components/UserPage";


function App() {

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
                <Route path="/" element={isLoggedIn ?
                    <>
                        <NavBar/>
                        <ChartPage/>
                    </> : <HomePage/>}/>


                <Route path="/charts" element={
                    <>
                        <NavBar/>
                        <ChartPage/>
                    </>
                }/>
                <Route path="/countries" element={
                    <>
                        <NavBar/>
                        <CountryList/>
                    </>
                }/>
                <Route path="/user" element={
                    <>
                        <NavBar/>
                        <UserPage/>
                    </>
                }/>
            </Routes>
        </Router>
    );


}


export default App;
