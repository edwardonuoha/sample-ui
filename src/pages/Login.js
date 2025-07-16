import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {BASE_URL} from "../api/constat";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

function LoginPage() {
    const { loginWithRedirect, isAuthenticated, getIdTokenClaims, isLoading, user } = useAuth0();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated && user){
            localStorage.setItem("isAuthenticated", JSON.stringify(true));
            localStorage.setItem("user", JSON.stringify(user));
        }
        const validateWithBackend = async () => {
            try {
                const tokenClaims = await getIdTokenClaims();
                console.log(tokenClaims)
                const token = tokenClaims?.__raw;
                if (!token) throw new Error("No ID token found");
                const response = await axios.post(`${BASE_URL}/api/auth/validate-oauth0`, {
                    oauth0Token: token,
                });
                console.log(response?.data)
                localStorage.setItem("token",JSON.stringify(response?.data))

                // Show success snackbar
                setOpenSnackbar(true);

                // Redirect after short delay
                // setTimeout(() => {
                //     //navigate("/");
                //     window.location.reload()
                // }, 1000);
            } catch (error) {
                console.error("Token validation failed:", error);
            }
        };

        if (isAuthenticated && !isLoading) {
            console.log('loading false isAuthenticated true......')
            validateWithBackend();
        }
    }, [isAuthenticated, isLoading, getIdTokenClaims, navigate]);

    const handleLogin = () => {
        loginWithRedirect();
    };

    return (
        <div style={styles.page}>
            <div style={styles.box}>
                <h1 style={styles.heading}>Welcome to Gold Coin</h1>
                <p style={styles.text}>Please click below to login and continue</p>
                <button
                    style={styles.button}
                    onClick={handleLogin}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#e2e8f0")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                >
                    Login
                </button>
            </div>

            <Snackbar open={openSnackbar} autoHideDuration={2000}>
                <Alert severity="success">Login successful!</Alert>
            </Snackbar>
        </div>
    );
}

const styles = {
    page: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    box: {
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "3rem 2rem",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
    },
    heading: {
        fontSize: "2.5rem",
        marginBottom: "1rem",
    },
    text: {
        fontSize: "1.1rem",
        marginBottom: "2rem",
    },
    button: {
        backgroundColor: "#fff",
        color: "#5a67d8",
        border: "none",
        padding: "0.75rem 2rem",
        fontSize: "1rem",
        fontWeight: "bold",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.3s ease",
    },
};

export default LoginPage;
