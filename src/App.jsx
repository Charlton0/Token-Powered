import React, { useState } from "react";
import WalletConnection from "./components/WalletConnection";
import MintNFT from "./components/MintNFT";
import RewardLog from "./components/RewardLog";
import Gallery from "./components/Gallery";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

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
