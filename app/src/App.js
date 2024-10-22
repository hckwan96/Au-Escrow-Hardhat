import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import AccountDetails, { loaderAccount } from './Pages/AccountDetails';
import ExistingContracts from './Pages/ExistingContracts';
import ContractDetails, { loaderContract }  from './Pages/ContractDetails';
import Layout from './Layout';
import { ethers } from 'ethers';
import './App.css';

const App = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [balanceETH, setBalanceETH] = useState(0);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const getAccounts = async (callback) => {
      try {
        const accounts = await provider.send('eth_requestAccounts', []);
        const balance = await provider.getBalance(accounts[0]);
    
        setAccount(accounts[0]);
        setBalanceETH(ethers.utils.formatEther(balance));
        setIsConnected(true);
    
        if (callback) {
          callback(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    };    

    const logOut = async () => {
      setIsConnected(false);
      setAccount(null);
      setBalanceETH(0);
      console.log("acc", account)
      console.log("acc", isConnected)
    };
    
    const router = createBrowserRouter([
      {
          path: "/",
          element: <Layout
                      account={account}
                      balance={balanceETH}
                      isConnected={isConnected}
                      getAccounts={getAccounts}
                      logOut={logOut} 
                    />,
          children: [
            {
              index: true,
              element: <Home 
                          isConnected={isConnected}
                          account={account}
                          signer={signer}
                        />,
            },
            {
              path: "contracts",
              element: <ExistingContracts
                          signer={signer} 
                          account={account} 
                          provider={provider}
                          isConnected={isConnected}
                        />,
            },
            {
              path: "account/:address",
              element: <AccountDetails 
                          isConnected={isConnected}
                        />,
              loader: loaderAccount,
              id: 'account'
            },
            {
              path: "escrow/:address",
              element: <ContractDetails 
                          signer={signer}
                          isConnected={isConnected}
                        />,
              loader: loaderContract,
              id: 'escrow'
            }
          ]
      }
    ]);

    return (
      <RouterProvider router={router} />
    );
};

export default App;
