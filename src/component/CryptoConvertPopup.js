import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from "@mui/material/TextField"
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {getUserAccessToken, getUserId} from "../api/user";
import {BASE_URL} from "../api/constat";

const CryptoConverterPopup = ({open, onClose}) => {
    const [cryptoList, setCryptoList] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState('ethereum');
    const [targetCurrency, setTargetCurrency] = useState('gbp');
    const [userAddress, setUserAddress] = useState(null)

    const [cryptoAmount, setCryptoAmount] = useState(1);
    const [convertedAmount, setConvertedAmount] = useState(0);

    const [prices, setPrices] = useState({});

    const targetCurrencies = ['eur', 'gbp'];

    // Fetch list of coins and prices
    // useEffect(() => {
    //     axios.get('https://api.coingecko.com/api/v3/coins/list')
    //         .then(response => {
    //             // filter only top coins or popular ones if needed
    //             const topCoins = response.data.slice(0, 100); // Limit to 100
    //             setCryptoList(topCoins);
    //         });
    // }, []);

    // Fetch conversion rate
    useEffect(() => {
        if (!selectedCrypto || !targetCurrency) return;

        axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
                ids: selectedCrypto,
                vs_currencies: targetCurrency
            }
        }).then(response => {
            setPrices(response.data);
            const rate = response.data[selectedCrypto]?.[targetCurrency] || 0;
            setConvertedAmount(cryptoAmount * rate);
        });
    }, [selectedCrypto, targetCurrency, cryptoAmount]);

    // Reverse update: If user edits converted amount
    const handleConvertedChange = (value) => {
        setConvertedAmount(value);
        const rate = prices[selectedCrypto]?.[targetCurrency] || 0;
        if (rate) {
            setCryptoAmount(value / rate);
        }
    };


    const buyCrypto = async () =>{
        try {
            const res = await axios.post(
                `${BASE_URL}/api/payment/buyCrypto`,
                {
                    "fiatRequest": {
                        "userId": getUserId(),
                        "amount": convertedAmount * 100, //amountInMinor
                        "currency": targetCurrency
                    },
                    "tokenId": selectedCrypto,
                    "tokenValue": cryptoAmount,
                    "exchangeRate": prices[selectedCrypto]?.[targetCurrency] || 0,
                    "userAddress": userAddress
                }, {
                    headers: {
                        Authorization: `Bearer ${getUserAccessToken()}`,
                    }
                });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        }catch (error){
            console.error(error)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Buy {selectedCrypto} from {targetCurrency}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="popup-row">

                        <TextField
                            type="number"
                            step="any"
                            value={cryptoAmount}
                            onChange={(e) => setCryptoAmount(parseFloat(e.target.value) || 0)}
                            label={selectedCrypto + " amount"}
                            defaultValue="0"
                            variant="filled"
                        />

                        <FormControl style={{width:'50%'}}>
                            <InputLabel>Crypto Currency</InputLabel>
                            <Select
                                value={selectedCrypto}
                                label="Select Crypto"
                                onChange={(e) => setSelectedCrypto(e.target.value)}
                            >
                                <MenuItem key="ethereum" value="ethereum">Ethereum</MenuItem>
                               {/*

                                {cryptoList.map(coin => (
                                    <MenuItem key={coin.id} value={coin.id}>{coin.name}</MenuItem>
                                ))}

                                */}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="popup-row">
                        <TextField
                            type="number"
                            step="any"
                            value={convertedAmount}
                            onChange={(e) => handleConvertedChange(parseFloat(e.target.value) || 0)}
                            label={targetCurrency + " amount"}
                            variant="filled"
                        />

                        <FormControl style={{width:'50%'}}>
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
                            type="text"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                            label={"Enter you " + selectedCrypto + " address"}
                            variant="filled"
                        />
                    </div>



                    <button className="popup-button" onClick={buyCrypto}>
                        Buy {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CryptoConverterPopup;
