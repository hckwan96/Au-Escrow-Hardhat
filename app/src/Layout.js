import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/header';

const Layout = ({ account, balance, isConnected, getAccounts, logOut }) => {
    return (
        <React.Fragment>
            <Header 
                isConnected={isConnected}
                getAccounts={getAccounts}
                logOut={logOut}
                account={account}
                balance={balance}
            />
            <Outlet />
        </React.Fragment>
    );
};

export default Layout;
