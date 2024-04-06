import { useState } from "react";
import useSyncProviders from "../../hooks/useSyncProviders";
import { EIP6963ProviderDetail } from "../../types/Metamask";

import './DetectWallets.css'

const DiscoverWalletProviders = () => {
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>();
  const [userAccount, setUserAccount] = useState<string>("");
  const providers = useSyncProviders();

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    const accounts: any = await providerWithInfo.provider
      .request({ method: "eth_requestAccounts" })
      .catch(console.error);

    if (accounts?.[0] as string) {
      setSelectedWallet(providerWithInfo);
      setUserAccount(accounts?.[0]);
    }
  };

  return (
    <section className="wallets-detection">
      <h2>Wallets Detected</h2>
      <div>
        {providers.length > 0 ? (
          providers?.map((provider: EIP6963ProviderDetail) => (
            <button
              key={provider.info.uuid}
              onClick={() => handleConnect(provider)}
            >
              <img src={provider.info.icon} alt={provider.info.name} />
              <div>{provider.info.name}</div>
            </button>
          ))
        ) : (
          <div>There are no announced providers.</div>
        )}
      </div>
      <hr />
      <h2>{userAccount ? "" : "No "}Wallet Selected</h2>
      {userAccount && (
        <div>
          <div>
            <img
              src={selectedWallet?.info?.icon}
              alt={selectedWallet?.info.name}
            />
            <div>{selectedWallet?.info.name}</div>
            <div>{userAccount}</div>
          </div>
        </div>
      )}
    </section>
  );
}
export default DiscoverWalletProviders