import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import axios from "axios";
import {getUserAccessToken, getUserId} from "../api/user";
import {BASE_URL} from "../api/constat";

const MakeMandatePayment = ({open, onClose}) => {
    const [amount, setAmount] = useState(1)
    const [mandateId, setMandateId] = useState(null)

    const makePayment = async () => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/payment/mandate-payment`, {
                    "userId":getUserId(),
                    "mandateId":mandateId,
                    "amountInMinor":amount * 100
                }, {
                    headers: {
                        Authorization: `Bearer ${getUserAccessToken()}`,
                    }
                });
            console.log("Response is .......");
            console.log(res.data);
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
                    <h2 className="modal-title">Make Mandate payment</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">

                    <div className="popup-row">
                        <TextField
                            fullWidth
                            type="text"
                            value={mandateId}
                            onChange={(e) => setMandateId(e.target.value)}
                            label={"Mandate Id"}
                            variant="filled"
                        />
                    </div>


                    <div className="popup-row">
                        <TextField
                            fullWidth
                            type="number"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            label={"Payment Amount"}
                            variant="filled"
                        />
                    </div>

                    <button className="popup-button" onClick={makePayment}>
                        Make Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MakeMandatePayment