import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.svg';
import { formatAddress, formatNumber } from '../tools/common';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
  const { isConnected, logOut, getAccounts, account, balance } = props;
  const navigate = useNavigate();
  const [pendingNav, setPendingNav] = useState(null);

  useEffect(() => {
    if (isConnected && pendingNav) {
      navigate(pendingNav, { replace: true });
      setPendingNav(null); // Clear pending navigation after successful navigation
    }
  }, [isConnected, pendingNav, navigate]);

  const onLogBtn = () => {
    if (isConnected) {
      console.log("lo")
      logOut();
      console.log("isConnected", isConnected)
    }
    else {
      getAccounts();
    }
  };

  const handleNav = (target) => {
    if (target === "/") {
      navigate(target, { replace: true });
      return;
    }
  
    if (target.startsWith("/account") && !isConnected) {
      console.log("isConnected", isConnected)
      getAccounts((walletAddress) => {
        setPendingNav(`/account/${walletAddress}`)
      });
      return;
    }
  
    if (!isConnected) {
      getAccounts();
      setPendingNav(target);  // Store pending navigation until connection is established
    }
    else {
      navigate(target, { replace: true });
    }
  };
  
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand onClick={() => handleNav('/')}>
          <div>
            <img className="logo-img App-logo" src={logo} alt="logo" />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll variant="underline">
            <Nav.Item>
              <Nav.Link onClick={() => handleNav('/')}>Create New Contract</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleNav('/contracts')}>Existing Contracts</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleNav(`/account/${account}`)}>Account Info</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Form className="d-flex">
              <Nav.Link href="#" disabled>
                {isConnected ? (
                  <div>
                    {formatAddress(account, "s")} (${formatNumber((balance * 1000) / 1000, 0)} ETH)
                  </div>
                ) : ''}
              </Nav.Link>
              <Button variant={isConnected ? 'success' : 'primary'} onClick={onLogBtn}>
                {isConnected ? 'Log Out' : 'Connect Wallet'}
              </Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export { Header };
