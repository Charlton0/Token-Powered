import React, { useState } from "react";
import WalletConnection from "./WalletConnection";
import MintNFT from "./MintNFT";
import RewardLog from "./RewardLog";
import Gallery from "./Gallery";

function App() {
  const [count, setCount] = useState(0);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // Pass down contract and account from WalletConnection
  // You can lift the state up or implement context/provider pattern for better management

  return (
    <div>
      <WalletConnection setContract={setContract} setAccount={setAccount} />
      {contract && account && (
        <>
          <MintNFT contract={contract} account={account} />
          <RewardLog contract={contract} />
          <Gallery contract={contract} />
        </>
      )}
    </div>
  );
}

export default App;
