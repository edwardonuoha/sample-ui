import React, { useState } from 'react';
import axios from 'axios';
import TextField from "@mui/material/TextField"
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {getUserAccessToken} from "../api/user";
import {BASE_URL, getInitiatePaymentBody} from "../api/constat";

const InitiatePaymentPopup =({open, onClose})=> {
    const[fiatAmount, setFiatAmount] = useState(1)
    const targetCurrencies = ['eur', 'gbp'];
    const [targetCurrency, setTargetCurrency] = useState('gbp');


    const fiatTransaction = async () =>{
        try {
            const res = await axios.post(`${BASE_URL}/api/payment/initiate`,
                getInitiatePaymentBody(fiatAmount,targetCurrency), {
                    headers: {
                        Authorization: `Bearer ${getUserAccessToken()}`,
                    }
                });
            if (res.data.url) {
                window.location.href = res.data.url;
            }

        } catch (error) {
            console.error("Error initiating payment:", error);
        }
    }


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Pay to Merchant</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="popup-row">
                        <FormControl fullWidth>
                            <InputLabel>Fiat Currency</InputLabel>
                            <Select
                                value={targetCurrency}
                                label="Select Currency"
                                onChange={(e) => setTargetCurrency(e.target.value)}
                            >
                                {targetCurrencies.map(cur => (
                                    <MenuItem key={cur} value={cur}>{cur.toUpperCase()}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="popup-row">
                        <TextField
                            fullWidth
                            type="number"
                            step="any"
                            value={fiatAmount}
                            onChange={(e) => setFiatAmount(parseFloat(e.target.value) || 0)}
                            label={targetCurrency + " amount"}
                            variant="filled"
                        />
                    </div>

                    <button className="popup-button" onClick={fiatTransaction}>
                        Donate {targetCurrency.toUpperCase() + fiatAmount}
                    </button>
                </div>
            </div>
        </div>
    );

};

export default InitiatePaymentPopup;