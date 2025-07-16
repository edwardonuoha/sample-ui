import React, {useEffect, useState} from 'react';
import {BASE_URL} from "../api/constat";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";

const MoonPayBuy = ({open, onClose}) => {
    const [crypto, setCrypto] = useState('eth');
    const [fiat, setFiat] = useState('usd');
    const [amount, setAmount] = useState('');
    const [limit, setLimit] = useState(null);
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const paymentMethods = ["ach_bank_transfer","credit_debit_card","paypal","gbp_bank_transfer","gbp_open_banking_payment","pix_instant_payment","sepa_bank_transfer"]

    // Fetch limits when crypto or fiat changes
    useEffect(() => {
        if (!crypto || !fiat) return;

        const fetchLimit = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/moonpay/limit?currencyCode=${crypto}&baseCurrencyCode=${fiat}`);
                const data = await res.json();
                setLimit(data);
                setQuote(null);
                setError('');
            } catch (err) {
                console.error('Error fetching limit', err);
                setError('Failed to load limits');
            }
        };

        fetchLimit();
    }, [crypto, fiat]);

    // Fetch quote when amount is valid
    useEffect(() => {
        if (!amount || isNaN(amount) || !limit) return;

        const numericAmount = parseFloat(amount);
        if (numericAmount < limit.minAmount || numericAmount > limit.maxAmount) {
            setQuote(null);
            return;
        }

        const fetchQuote = async () => {
            if (crypto && fiat && numericAmount > limit?.baseCurrency?.minBuyAmount && numericAmount < limit?.baseCurrency?.maxBuyAmount && paymentMethod) {
                try {
                    const res = await fetch(
                        `${BASE_URL}/api/moonpay/buy-quote?currencyCode=${crypto}&baseCurrencyCode=${fiat}&baseCurrencyAmount=${numericAmount}&paymentMethod=${paymentMethod}`
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
    }, [amount, crypto, fiat, limit, paymentMethod]);

    // Redirect to MoonPay with signed URL
    const redirectToMoonPay = async () => {
        if (!email || !amount || isNaN(amount)) {
            setError('Please enter a valid email and amount');
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/api/moonpay/generate-url`, {
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
                    <h2 className="modal-title">Fiat OnRamp Through MoonPay</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">

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

                            </Select>
                        </FormControl>
                    </div>

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

                    <div>
                        {limit?.baseCurrency && (
                            <p>
                                Min: {limit?.baseCurrency?.minBuyAmount} {fiat.toUpperCase()} | Max: {limit?.baseCurrency?.maxBuyAmount} {fiat.toUpperCase()}
                            </p>
                        )}
                    </div>

                    <div className="popup-row">
                        <TextField
                            fullWidth
                            type="number"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount((e.target.value) || 0)}
                            label={`Enter amount between ${limit?.baseCurrency?.minBuyAmount} - ${limit?.baseCurrency?.maxBuyAmount}`}
                            placeholder={`Enter amount between ${limit?.baseCurrency?.minBuyAmount} - ${limit?.baseCurrency?.maxBuyAmount}`}
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
                                    You will receive approximately {quote?.quoteCurrencyAmount} {crypto.toUpperCase()} at a rate of {quote?.quoteCurrencyPrice} {fiat.toUpperCase()}/{crypto.toUpperCase()} with charge of {quote?.feeAmount} and network charge of {quote?.networkFeeAmount}
                                    \n Total Amount: {quote?.totalAmount}


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

export default MoonPayBuy;


