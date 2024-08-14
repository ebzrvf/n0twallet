import {TonConnectButton} from "@tonconnect/ui-react";
import './header.scss';

export const Header = () => {
    return <header>
        <h1 className="noth1">NOTWallet</h1>
        <TonConnectButton/>
    </header>
}
