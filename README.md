# 🎨 Token-Powered NFT Platform – A Reward System for Creators

This is a decentralized application (dApp) built for **Lisk Africa Bootcamp – Week 6**. It enables users to mint NFTs while rewarding creators with ERC20 tokens every time their NFT is minted.

## 🚀 Project Overview

This full-stack dApp integrates:

- **ERC721 NFTs** – Representing digital artworks
- **ERC20 Token (CreatorToken)** – Used to reward creators
- **React Frontend** – For wallet connection, NFT minting, and reward tracking
- **NFT.Storage** – For decentralized storage of metadata and media files

---

## 🛠️ Smart Contract Functionality

The smart contract combines both **ERC20** and **ERC721** standards:

### ✅ ERC20 – CreatorToken

- **Non-public minting** (Only the contract can mint)
- Used to reward NFT creators
- Key functions:
  - `rewardCreator(address to, uint256 amount)`
  - `balanceOf`, `transfer`, `approve`, `transferFrom`, `allowance`

### ✅ ERC721 – ArtNFT

- Any user can mint NFTs with metadata URI
- Automatically tracks the creator of each NFT
- Emits an `ArtMinted` event on mint
- On each mint:
  - Calls `rewardCreator()` to reward the creator with tokens

---

## 💻 Frontend Features

The React frontend includes:

### 🔗 Wallet Connection

- Connects to MetaMask
- Displays wallet address and token balances

### 🖼️ NFT Minting

- Users can:
  - Upload artwork and metadata
  - Store metadata on IPFS via **NFT.Storage**
  - Mint the NFT on-chain
- Shows transaction confirmation and hash

### 🎁 Reward System UI

- Displays current ERC20 token balance
- Logs minted NFTs and creator rewards using contract events

### 🖼️ NFT Gallery

- Fetches all minted NFTs
- Displays:
  - Creator address
  - Token ID
  - Metadata (image, name, description)

---

## 📦 Tech Stack

- **Solidity** – Smart contract language
- **RemixIDE** – Ethereum development environment
- **React** – Frontend framework
- **Ethers.js** – Blockchain interaction
- **NFT.Storage** – Decentralized file storage
- **MetaMask** – Wallet integration
- **Lisk Sepolia Testnet** – Deployment network

---

## 🌍 Live Deployments

- **Smart Contract:** [Lisk Sepolia](https://sepolia.etherscan.io/address/0x76e4c33e38405a1dd74111141ae4fd942c55bb49 )
- **Frontend (Netlify/Vercel):** [Live dApp](https://your-dapp-link.netlify.app/)

---

## 📁 Project Structure

