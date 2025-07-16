import React, {useEffect, useState} from 'react';
import {BASE_URL} from "../api/constat";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";

const MoonPaySell = ({open, onClose}) => {
    const [crypto, setCrypto] = useState('eth');
    const [fiat, setFiat] = useState('eur');
    const [amount, setAmount] = useState('');
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const paymentMethods = ["ach_bank_transfer","credit_debit_card","paypal","gbp_bank_transfer","gbp_open_banking_payment","pix_instant_payment","sepa_bank_transfer"]


    // Fetch quote when amount is valid
    useEffect(() => {
        if (!amount || isNaN(amount) ) return;

        const numericAmount = parseFloat(amount);
        const fetchQuote = async () => {
            if (crypto && fiat && numericAmount > 0 && paymentMethod) {
                try {
                    const res = await fetch(
                        `${BASE_URL}/api/moonpay/sell-quote?cryptoCurrency=${crypto}&fiatCurrency=${fiat}&cryptoAmoount=${numericAmount}&paymentMethod=${paymentMethod}`
                    );
                    const data = await res.json();
                    setQuote(data);
                    setError('');
                } catch (err) {
                    console.error('Error fetching quote', err);
                    setError('Failed to load quote');
                }
            }
        };

        fetchQuote();
    }, [amount, crypto, fiat, paymentMethod]);

    // Redirect to MoonPay with signed URL
    const redirectToMoonPay = async () => {
        if (!email || !amount || isNaN(amount)) {
            setError('Please enter a valid email and amount');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/api/moonpay/sell/generate-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress,
                    email,
                    cryptoCurrencyCode: crypto,
                    fiatCurrencyCode: fiat,
                    amount: parseFloat(amount),
                    paymentMethod: paymentMethod
                })
            });

            const data = await res.json();
            console.log(data)
            if (data?.signedUrl) {
                console.log(data?.signedUrl)
                window.location.href = data.signedUrl; // Redirect
            } else {
                throw new Error('No signed URL returned');
            }
        } catch (err) {
            console.error('Redirect failed', err);
            setError('Could not redirect to MoonPay');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Fiat OffRamp Through MoonPay</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">

                    <div className="popup-row">
                        <FormControl fullWidth>
                            <InputLabel>Select Crypto</InputLabel>
                            <Select
                                value={crypto}
                                label="Select Crypto"
                                onChange={(e) => setCrypto(e.target.value)}
                            >
                                <MenuItem key="eth" value="eth">Ethereum</MenuItem>
                                <MenuItem key="btc" value="btc">Bitcoin</MenuItem>
                            </Select>
                        </FormControl>
                    </div>


                    <div className="popup-row">
                        <FormControl fullWidth>
                            <InputLabel>Select Fiat</InputLabel>
                            <Select
                                value={fiat}
                                label="Select Fiat"
                                onChange={(e) => setFiat(e.target.value)}
                            >
                                <MenuItem key="eur" value="eur">EUR</MenuItem>
                                <MenuItem key="usd" value="usd">USD</MenuItem>
                                <MenuItem key="gbp" value="gbp">GBP</MenuItem>
                                <MenuItem key="cad" value="cad">CAD</MenuItem>

                            </Select>
                        </FormControl>
                    </div>


                    <div className="popup-row">
                        <TextField
                            fullWidth
                            type="number"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount((e.target.value) || 0)}
                            label={`Enter ${crypto} amount to sell`}
                            variant="filled"
                        />
                    </div>

                    <div className="popup-row">
                        <FormControl fullWidth>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={paymentMethod}
                                label="Select Payment Method"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                {paymentMethods.map(method => (
                                    <MenuItem key={method} value={method}>{method}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="popup-row">
                        <TextField
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            label="Enter your email"
                            variant="filled"
                        />
                    </div>

                    <div className="popup-row">
                        <TextField
                            fullWidth
                            type="text"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="Enter your wallet address"
                            label="Enter your wallet address"
                            variant="filled"
                        />
                    </div>


                    <div className="popup-row">
                        {quote && (
                            <div style={{ marginTop: '10px' }}>
                                <strong>Quote:</strong>
                                <p>
                                    You will receive {quote?.quoteCurrencyAmount} {fiat.toUpperCase()} at a rate of {quote?.baseCurrencyPrice} {fiat.toUpperCase()}/{crypto.toUpperCase()} with addition charge of {quote?.feeAmount} and network charge of {quote?.networkFeeAmount}
                                    <b> Total Amount: {quote?.totalAmount}</b>


                                </p>
                            </div>
                        )}
                    </div>


                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button className="popup-button" onClick={redirectToMoonPay} disabled={loading}>
                        {loading ? 'Redirecting...' : 'Continue to MoonPay'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MoonPaySell;
