import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import { ThemeProvider, CssBaseline } from '@mui/material';
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CallbackPage from "./pages/CallbackPage";
import PaymentCallbackPage from "./pages/PaymentCallbackPage";
import MoonPayBuy from "./component/MoonPayBuy";
import LoginRedirect from "./pages/LoginRedirect";
import { theme } from './theme';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        let isAuthenticatedStr = JSON.parse(localStorage.getItem("isAuthenticated") ?? "false")
        let loggedInUser = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : {}
        setIsAuthenticated(isAuthenticatedStr)
        setUser(loggedInUser)
    }, [isAuthenticated]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? (<Dashboard user={user} />) : (<LoginPage />)}
                    />
                    <Route path="/login" element={<LoginRedirect />} />
                    <Route path="/callback" element={<CallbackPage />} />
                    <Route path="/payment/callback" element={<PaymentCallbackPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
