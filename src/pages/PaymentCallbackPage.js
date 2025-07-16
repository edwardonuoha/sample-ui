import React, {useEffect, useRef, useState} from "react";

import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {getUserAccessToken} from "../api/user";
import {BASE_URL} from "../api/constat";

function PaymentCallbackPage() {
    const [status, setStatus] = useState("loading"); // 'loading', 'SETTLED', 'FAILED'
    const [paymentId, setPaymentId] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [confirmResponse, setConfirmResponse] = useState(null)
    const location = useLocation();
    const navigate = useNavigate();
    const hasCalledApi = useRef(false);
    const [mandateId, setMandateId] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get("payment_id")
        const mandateId = params.get("mandate_id")
        const transactionId = params.get("transactionId")
        setPaymentId(paymentId)
        setMandateId(mandateId)
        setTransactionId(transactionId)

        if (!hasCalledApi.current && paymentId) {
            hasCalledApi.current = true;  // Set to true so it doesn't run again
            axios
                .post(`${BASE_URL}/api/payment/confirm/${paymentId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${getUserAccessToken()}`,
                        },
                    })
                .then((res) => {
                    console.log(res.data)
                    setConfirmResponse(res.data)
                    setStatus(res.data?.status)
                })
                .catch(() => setStatus("FAILED"));
        }

        if (!hasCalledApi.current && transactionId) {
            hasCalledApi.current = true;  // Set to true so it doesn't run again
            axios
                .get(`${BASE_URL}/api/moonpay/transaction/${transactionId}`,
                    {
                        // headers: {
                        //     Authorization: `Bearer ${getUserAccessToken()}`,
                        // },
                    })
                .then((res) => {
                    console.log(res.data)
                    setConfirmResponse(res.data)
                    setStatus(res.data?.status)
                })
                .catch(() => setStatus("FAILED"));
        }

        if (!hasCalledApi.current && mandateId) {
            hasCalledApi.current = true;  // Set to true so it doesn't run again
            axios
                .post(`${BASE_URL}/api/payment/authorize-mandate/${mandateId}`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${getUserAccessToken()}`,
                        },
                    })
                .then((res) => {
                    console.log(res.data)
                    if(res.data === true) setStatus("SETTLED")
                    else setStatus("FAILED")
                })
                .catch(() => setStatus("FAILED"));
        }
    }, [location]);  // Add `hasCalledApi` to ensure API only fires once


    const infoDisplay = (
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
            {paymentId || mandateId ?
                <div><strong>{paymentId ? "Payment Id:" : mandateId ? "Mandate Id" : "Transaction Id"} </strong> {paymentId || mandateId || transactionId ||"N/A"}</div>
                : null}
        </div>
    );

    const getFormattedAmount =  ( (amount, currency) => {
        if(amount && currency) {
            let amountInHigherDimension = amount / 100;
            return amountInHigherDimension?.toLocaleString('en-CA', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }else{
            return ""
        }


    });

    const resultDisplay =(
        <div className="payment-details">
            <div className="label">Payment ID:</div> <div>{paymentId || "N/A"}</div>
            <div className="label">Payment Status:</div> <div>{confirmResponse?.status || "N/A"}</div>
            <div className="label">Amount:</div> <div>{getFormattedAmount(confirmResponse?.amount, confirmResponse?.currency) || "N/A"}</div>
            <div className="label">User ID:</div> <div>{confirmResponse?.userId || "N/A"}</div>
            <div className="label">Currency:</div> <div>{confirmResponse?.currency || "N/A"}</div>
        </div>
    );

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            {status === "loading" ? (
                <>
                    <CircularProgress />
                    <p>{paymentId || transactionId ? "Confirming your Payment" : "Authorizing your mandate"}</p>
                    {infoDisplay}

                </>
            ) : status === "SETTLED" || status === "AUTHORIZED" || status === "completed" ? (
                <>
                    <CheckCircleIcon style={{ fontSize: 80, color: "green" }} />
                    <h2>{paymentId || transactionId ? "Payment  " + status + " !" : "Mandate Authorized !"}</h2>
                    {paymentId ?  resultDisplay : null}

                    <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
                </>
            ) : (
                <>
                    <CancelIcon style={{ fontSize: 80, color: "red" }} />
                    <h2> {paymentId || transactionId? "Payment error" : "Mandate Un-authorized"} </h2>
                    {resultDisplay}
                    <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
                </>
            )}
        </div>
    );

}

export default PaymentCallbackPage;
