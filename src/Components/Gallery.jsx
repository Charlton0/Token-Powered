import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Gallery.css"; // Import your CSS

function Gallery({ contract }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function fetchNFTs() {
      if (!contract) return;
      try {
        const total = await contract.tokenIdCounter();
        const items = [];

        for (let i = 0; i < total.toNumber(); i++) {
          const tokenURI = await contract.tokenURI(i);
          const creator = await contract.creators(i);
          const meta = await axios.get(
            tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          items.push({
            tokenId: i,
            creator,
            metadata: meta.data,
          });
        }
        setNfts(items);
      } catch (err) {
        console.error(err);
      }
    }
    fetchNFTs();
  }, [contract]);

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="nft-grid">
        {nfts.map((nft) => (
          <div className="nft-card" key={nft.tokenId}>
            <img
              src={nft.metadata.image.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              )}
              alt={nft.metadata.name}
              className="nft-image"
            />
            <h3 className="nft-title">{nft.metadata.name}</h3>
            <p className="nft-description">{nft.metadata.description}</p>
            <p className="nft-creator">Creator: {nft.creator}</p>
            <p className="nft-id">Token ID: {nft.tokenId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
