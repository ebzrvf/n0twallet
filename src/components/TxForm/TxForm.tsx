import React, {useCallback, useState} from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {SendTransactionRequest, useTonAddress, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import { toNano, beginCell, Address } from '@ton/ton'

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.

const defaultTx: SendTransactionRequest = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
        {
            address: '',
            amount: '',
            payload: '',
        },
    ],
};

export function TxForm() {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();
	const currentWallet = useTonAddress();
	

    const onAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value), []);
    const onAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value), []);

    const onSubmit = useCallback(() => {
        const tonValue = parseFloat(amount);
        if (isNaN(tonValue)) {
            alert('Invalid amount');
            return;
        }
        const nanotonAmount = (tonValue * 1_000_000_000).toString();
    
        const tx: SendTransactionRequest = {
            ...defaultTx,
            messages: [
                {
                    address,
                    amount: nanotonAmount,
                    payload: '',
                },
            ],
        };
        tonConnectUi.sendTransaction(tx);
    }, [address, amount, tonConnectUi]);

    const walletLink = `https://tonviewer.com/${currentWallet}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentWallet)
            .then(() => {
                alert('Your wallet address has been copied to the clipboard');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className="send-tx-form">
            <h3>Send Transaction</h3>
            <div className="input-group">
                <label className='labelAddress'>Address:</label>
                <input type="text" value={address} onChange={onAddressChange} className="styled-input" />
            </div>
            <div className="input-group">
                <label className='labelAmount'>Amount (in TON):</label>
                <input type="text" value={amount} onChange={onAmountChange} className="styled-input" />
            </div>
            {wallet ? (
                <button onClick={onSubmit} className='connectButton'>Send</button>
            ) : (
                <button onClick={() => tonConnectUi.openModal()} className='connectButton'>Connect wallet to try it out</button>
            )}
			{wallet && (
            <div className="currentWalletAddress">
                <label>Connected Wallet Address: <p><a href={walletLink} className='crntwlt' target="_blank">{currentWallet}</a></p></label>
                <label><p><button className='copyLink' onClick={copyToClipboard}>Copy Address</button></p></label>
				<label>Connected app: <p className='crntwlt'>{wallet.device.appName}</p><p className='crntwlt'>{wallet.device.appVersion}</p></label>
				<label>Device: <p className="crntwlt">{wallet.device.platform}</p></label>
            </div>
        )}
		<div className="madeby">
			<label>Made by: <a href="https://t.me/bzrvv007"className='madebya'>@ebzrvf</a></label>
		</div>
		<div className='appInfo'>
			<label>NOTWallet @ 2024. App is on beta stage, updates will be released soon.</label>
		</div>
        </div>
    );
}

