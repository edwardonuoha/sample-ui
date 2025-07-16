import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import axios from "axios";
import {getUserAccessToken, getUserId} from "../api/user";
import {BASE_URL} from "../api/constat";

const SchedulePaymentPopup = ({open, onClose}) => {
    const[maximumIndividualAmount, setMaximumIndividualAmount] = useState(1)
    const targetCurrencies = ['eur', 'gbp'];
    const [targetCurrency, setTargetCurrency] = useState('gbp');
    const periodicTypes = ['DAY','WEEK','FORTNIGHT', 'MONTH','HALF_YEAR', 'YEAR']
    const countryCodes = ['AT', 'BE', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'IE', 'IT', 'LT', 'NL', 'NO', 'PL', 'PT', 'RO'];
    const [selectedCountryCode, setSelectedCountryCode] = useState('GB')
    const [selectedPeriodicType, setSelectedPeriodicType] = useState('DAY')

    const schedulePayment = async () => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/payment/recursive`, {
                    "userId":getUserId(),
                    "currency": targetCurrency,
                    "maximumIndividualAmountInMinor":maximumIndividualAmount * 100,
                    "periodicType":selectedPeriodicType,
                    "countryCode":selectedCountryCode
                }, {
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
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Register Schedule Payment</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="popup-row">
                        <FormControl fullWidth>
                            <InputLabel>Select Country Code</InputLabel>
                            <Select
                                value={selectedCountryCode}
                                label="Select CountryCode"
                                onChange={(e) => setSelectedCountryCode(e.target.value)}
                            >
                                {countryCodes.map(cur => (
                                    <MenuItem key={cur} value={cur}>{cur.toUpperCase()}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="popup-row">
                        <FormControl fullWidth>
                            <InputLabel>Select Periodic Type</InputLabel>
                            <Select
                                value={selectedPeriodicType}
                                label="Select Currency"
                                onChange={(e) => setSelectedPeriodicType(e.target.value)}
                            >
                                {periodicTypes.map(cur => (
                                    <MenuItem key={cur} value={cur}>{cur.toUpperCase()}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>



                    <div className="popup-row">
                        <FormControl fullWidth>
                            <InputLabel>Select Currency</InputLabel>
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
                            value={maximumIndividualAmount}
                            onChange={(e) => setMaximumIndividualAmount(parseFloat(e.target.value) || 0)}
                            label={"Maximum Individual Amount"}
                            variant="filled"
                        />
                    </div>

                    <button className="popup-button" onClick={schedulePayment}>
                       Schedule Payment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SchedulePaymentPopup;