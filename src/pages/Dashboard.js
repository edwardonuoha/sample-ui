import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Paper,
} from '@mui/material';

import {
    Menu as MenuIcon,
    AccountCircle,
    Dashboard as DashboardIcon,
    Payment as PaymentIcon,
    AccountBalance as BankIcon,
    CurrencyBitcoin as CryptoIcon,
    ExitToApp as LogoutIcon,
} from '@mui/icons-material';

import { getUserAccessToken, getUserId } from "../api/user";
import axios from "axios";
import CryptoConverterPopup from "../component/CryptoConvertPopup";
import InitiatePaymentPopup from "../component/InitiatePaymentPopup";
import SchedulePaymentPopup from "../component/SchedulePaymentPopup";
import MakeMandatePayment from "../component/MakeMandatePayment";
import { BASE_URL, API_ENDPOINTS } from "../api/constat";
import MoonPayBuy from "../component/MoonPayBuy";
import MoonPaySell from "../component/MoonPaySell";

const Dashboard = ({ user }) => {
    const { logout } = useAuth0();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openBuyCryptoPopup, setOpenBuyCryptoPopup] = useState(false);
    const [openInitiatePaymentPopup, setOpenInitiatepaymentPopup] = useState(false);
    const [openSchedulePaymentPopup, setSchedulePaymentPopup] = useState(false);
    const [openPayMandate, setOpenPayMandate] = useState(false);
    const [openMoonPay, setOpenMoonPay] = useState(false);
    const [openMoonPaySell, setOpenMoonPaySell] = useState(false);
    const open = Boolean(anchorEl);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleConnectBank = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/kyc/link-bank`, {
                headers: {
                    Authorization: `Bearer ${getUserAccessToken()}`,
                }
            });
            window.location.href = res.data;
        } catch (e) {
            console.error(e)
        }
    };

    const handleLogout = async () => {
        try {
            const accessToken = getUserAccessToken();
            if (accessToken) {
                await axios.post(API_ENDPOINTS.LOGOUT, 
                    {}, // Empty body - token is in Authorization header
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error during backend logout:', error);
        } finally {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            logout({ 
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        }
    };

    const drawerContent = (
        <List>
            <ListItem>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {user?.picture ? (
                        <Avatar src={user.picture} alt={user.name} />
                    ) : (
                        <AccountCircle />
                    )}
                    <Typography variant="subtitle1">{user?.name}</Typography>
                </Box>
            </ListItem>
            <ListItem button onClick={() => {}}>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => setOpenInitiatepaymentPopup(true)}>
                <ListItemIcon><PaymentIcon /></ListItemIcon>
                <ListItemText primary="Payments" />
            </ListItem>
            <ListItem button onClick={handleConnectBank}>
                <ListItemIcon><BankIcon /></ListItemIcon>
                <ListItemText primary="Link Bank" />
            </ListItem>
            <ListItem button onClick={() => setOpenMoonPay(true)}>
                <ListItemIcon><CryptoIcon /></ListItemIcon>
                <ListItemText primary="Buy Crypto" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
        </List>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Drawer */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': { 
                            width: 240,
                            boxSizing: 'border-box',
                            bgcolor: 'background.paper',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                            bgcolor: 'background.paper',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <AppBar position="fixed" color="default" elevation={1}>
                    <Toolbar>
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Gold Coin Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar /> {/* Spacing for fixed AppBar */}

                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        {/* Quick Actions */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', gap: 2, overflowX: 'auto' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenInitiatepaymentPopup(true)}
                                >
                                    New Payment
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleConnectBank}
                                >
                                    Link Bank
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenMoonPay(true)}
                                >
                                    Buy Crypto
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenMoonPaySell(true)}
                                >
                                    Sell Crypto
                                </Button>
                            </Paper>
                        </Grid>

                        {/* Main Dashboard Cards */}
                        <Grid item xs={12} md={6} lg={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Payments
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => setOpenInitiatepaymentPopup(true)}
                                    >
                                        Initiate Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Scheduled Payments
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => setSchedulePaymentPopup(true)}
                                    >
                                        Schedule Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Mandate Payments
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => setOpenPayMandate(true)}
                                    >
                                        Make Mandate Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Cryptocurrency
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => setOpenMoonPay(true)}
                                            >
                                                Buy Crypto
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => setOpenMoonPaySell(true)}
                                            >
                                                Sell Crypto
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>

                {/* Popups */}
                {openBuyCryptoPopup && (
                    <CryptoConverterPopup
                        open={openBuyCryptoPopup}
                        onClose={() => setOpenBuyCryptoPopup(false)}
                    />
                )}
                {openInitiatePaymentPopup && (
                    <InitiatePaymentPopup
                        open={openInitiatePaymentPopup}
                        onClose={() => setOpenInitiatepaymentPopup(false)}
                    />
                )}
                {openSchedulePaymentPopup && (
                    <SchedulePaymentPopup
                        open={openSchedulePaymentPopup}
                        onClose={() => setSchedulePaymentPopup(false)}
                    />
                )}
                {openPayMandate && (
                    <MakeMandatePayment
                        open={openPayMandate}
                        onClose={() => setOpenPayMandate(false)}
                    />
                )}
                {openMoonPay && (
                    <MoonPayBuy
                        open={openMoonPay}
                        onClose={() => setOpenMoonPay(false)}
                    />
                )}
                {openMoonPaySell && (
                    <MoonPaySell
                        open={openMoonPaySell}
                        onClose={() => setOpenMoonPaySell(false)}
                    />
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;