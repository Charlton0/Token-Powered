import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

function RewardLog({ contract }) {
  const [mintEvents, setMintEvents] = useState([]);
  const [rewardEvents, setRewardEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract) return;

    async function fetchEvents() {
      setLoading(true);
      try {
        const mintFilter = contract.filters.ArtMinted();
        const rewardFilter = contract.filters.CreatorRewarded();

        const mintLogs = await contract.queryFilter(mintFilter);
        const rewardLogs = await contract.queryFilter(rewardFilter);

        setMintEvents(mintLogs);
        setRewardEvents(rewardLogs);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
      setLoading(false);
    }

    fetchEvents();

    const onArtMinted = (creator, tokenId, tokenURI) => {
      setMintEvents((prev) => [
        ...prev,
        { creator, tokenId: tokenId.toString(), tokenURI },
      ]);
    };

    const onCreatorRewarded = (to, amount) => {
      setRewardEvents((prev) => [...prev, { to, amount: amount.toString() }]);
    };

    contract.on("ArtMinted", onArtMinted);
    contract.on("CreatorRewarded", onCreatorRewarded);

    return () => {
      contract.off("ArtMinted", onArtMinted);
      contract.off("CreatorRewarded", onCreatorRewarded);
    };
  }, [contract]);

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="reward-log">
      <h2>Minted NFTs</h2>
      <table className="event-table">
        <thead>
          <tr>
            <th>Creator</th>
            <th>Token ID</th>
            <th>Token URI</th>
          </tr>
        </thead>
        <tbody>
          {mintEvents.map((e, i) => (
            <tr key={`mint-${e.transactionHash ?? i}`}>
              <td>{e.creator || e.args?.creator || "N/A"}</td>
              <td>{e.tokenId || e.args?.tokenId?.toString() || "N/A"}</td>
              <td>
                <a
                  href={e.tokenURI || e.args?.tokenURI || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {e.tokenURI || e.args?.tokenURI || "View"}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Creator Rewards</h2>
      <table className="event-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Amount (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {rewardEvents.map((e, i) => {
            const amountRaw = e.amount || e.args?.amount;
            const toAddress = e.to || e.args?.to || "N/A";

            let amountFormatted = "N/A";
            try {
              amountFormatted = ethers.utils.formatUnits(amountRaw, 18);
            } catch {
              // fallback
            }

            return (
              <tr key={`reward-${e.transactionHash ?? i}`}>
                <td>{toAddress}</td>
                <td>{amountFormatted}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RewardLog;
