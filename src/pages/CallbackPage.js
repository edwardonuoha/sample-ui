import React, { useEffect, useState, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {getUserAccessToken} from "../api/user";
import {BASE_URL} from "../api/constat";

function CallbackPage() {
    const [status, setStatus] = useState("loading"); // 'loading', 'verified', 'unverified'
    const [code, setCode] = useState(null);
    const [scope, setScope] = useState(null);
    const [stateParam, setStateParam] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const hasCalledApi = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const codeParam = params.get("code");
        const scopeParam = params.get("scope");
        const stateValue = params.get("state");

        setCode(codeParam);
        setScope(scopeParam);
        setStateParam(stateValue);

        if (codeParam && scopeParam && stateValue && !hasCalledApi.current) {
            hasCalledApi.current = true;  // Set to true so it doesn't run again
                axios
                    .post(`${BASE_URL}/api/kyc/link-bank/verify`,
                        {
                            code: codeParam,
                            scope: scopeParam,
                            state: stateValue,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${getUserAccessToken()}`,
                            },
                        })
                    .then((res) => {
                        if (res.data === true) {
                            setStatus("verified");
                        } else {
                            setStatus("unverified");
                        }
                    })
                    .catch(() => setStatus("unverified"));
        }
    }, [location]);  // Add `hasCalledApi` to ensure API only fires once


    const infoDisplay = (
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
            <div><strong>Code:</strong> {code || "N/A"}</div>
            <div><strong>Scope:</strong> {scope || "N/A"}</div>
            <div><strong>State:</strong> {stateParam || "N/A"}</div>
        </div>
    );

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            {status === "loading" ? (
                <>
                    <CircularProgress />
                    <p>Verifying your bank connection...</p>
                    {infoDisplay}
                </>
            ) : status === "verified" ? (
                <>
                    <CheckCircleIcon style={{ fontSize: 80, color: "green" }} />
                    <h2>Bank Account Verified!</h2>
                    <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
                </>
            ) : (
                <>
                    <CancelIcon style={{ fontSize: 80, color: "red" }} />
                    <h2>Verification Failed </h2>
                    <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
                </>
            )}
        </div>
    );
}

export default CallbackPage;
