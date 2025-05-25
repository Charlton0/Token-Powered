import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import NFTPlatformABI from "./NFTPlatformABI.json"; // Your contract ABI here

const CONTRACT_ADDRESS = "your_contract_address_here";

function WalletConnection() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [erc20Balance, setErc20Balance] = useState("0");

  useEffect(() => {
    if (contract && account) {
      fetchErc20Balance();
    }
  }, [contract, account]);

  async function connectWallet() {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const prov = new ethers.providers.Web3Provider(connection);
      const signer = prov.getSigner();
      const addr = await signer.getAddress();

      setProvider(prov);
      setSigner(signer);
      setAccount(addr);

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTPlatformABI,
        signer
      );
      setContract(nftContract);
    } catch (err) {
      console.error("Failed to connect wallet", err);
    }
  }

  async function fetchErc20Balance() {
    if (!contract || !account) return;
    try {
      const balance = await contract.balanceOf(account);
      const decimals = await contract.decimals();
      setErc20Balance(ethers.utils.formatUnits(balance, decimals));
    } catch (err) {
      console.error("Failed to fetch ERC20 balance", err);
    }
  }

  return (
    <div className="wallet-connection">
      {!account ? (
        <button className="connect-button" onClick={connectWallet}>
          Connect MetaMask
        </button>
      ) : (
        <div className="wallet-details">
          <p>
            <strong>Account:</strong> {account}
          </p>
          <p>
            <strong>CreatorToken Balance:</strong> {erc20Balance}
          </p>
        </div>
      )}
    </div>
  );
}

export default WalletConnection;
