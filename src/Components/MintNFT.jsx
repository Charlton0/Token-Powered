import React, { useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { ethers } from "ethers";
import "./MintNFT.css";

const NFT_STORAGE_TOKEN = "YOUR_NFT_STORAGE_API_KEY"; // Replace with your token

function MintNFT({ contract, account }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState(null);

  async function uploadToIPFS() {
    if (!file || !name || !description) {
      alert("Please fill all fields and select a file");
      return null;
    }

    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

    const metadata = await client.store({
      name,
      description,
      image: new File([file], file.name, { type: file.type }),
    });

    return metadata.url;
  }

  async function mintNFT() {
    if (!contract || !account) {
      alert("Connect wallet first");
      return;
    }
    setMinting(true);
    setTxHash(null);

    try {
      const tokenURI = await uploadToIPFS();
      if (!tokenURI) {
        setMinting(false);
        return;
      }

      const tx = await contract.mintNFT(tokenURI);
      const receipt = await tx.wait();

      setTxHash(receipt.transactionHash);
      alert("NFT minted successfully!");
    } catch (err) {
      console.error(err);
      alert("Minting failed");
    }
    setMinting(false);
  }

  return (
    <div className="mint-container">
      <h2>Mint New NFT</h2>

      <div className="mint-form">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mint-input"
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mint-input"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mint-textarea"
        ></textarea>

        <button onClick={mintNFT} disabled={minting} className="mint-button">
          {minting ? "Minting..." : "Mint NFT"}
        </button>

        {txHash && (
          <p className="tx-hash">
            Transaction Hash:{" "}
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default MintNFT;
