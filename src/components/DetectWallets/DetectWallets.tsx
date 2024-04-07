import { useState } from "react"
import useSyncProviders from "../../hooks/useSyncProviders"
import { EIP6963ProviderDetail } from "../../types/Metamask"
import useCloseModalClickOut from "../../hooks/useCloseModalClickOut"
import "./DetectWallets.css"


interface DiscoverWalletProvidersProps {
  setProvider: (provider: any) => void
  setUserAccount: (userAccount: string) => void
  setOpenWalletModal: (openWalletModal: boolean) => void
  userAccount: string
}

const DiscoverWalletProviders = ({ setProvider, setUserAccount, userAccount, setOpenWalletModal }: DiscoverWalletProvidersProps) => {

  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
  const providers = useSyncProviders()

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    setProvider(providerWithInfo.provider)
    const accounts: any = await providerWithInfo.provider.request({ method: "eth_requestAccounts" }).catch(console.error)

    if (accounts?.[0] as string) {
      setSelectedWallet(providerWithInfo)
      setUserAccount(accounts?.[0])
    }
  }

  const modalRef = useCloseModalClickOut(setOpenWalletModal)
  return (
    <div id="modal-detection">
      <section className="wallets-detection" ref={modalRef}>
        <h2>Wallets Detected</h2>
        <div>
          {providers.length > 0 ? (
            providers?.map((provider: EIP6963ProviderDetail) => (
              <button key={provider.info.uuid} onClick={() => handleConnect(provider)}>
                <img src={provider.info.icon} alt={provider.info.name} />
                <strong>{provider.info.name}</strong>
              </button>
            ))
          ) : (
            <div>There are no announced providers.</div>
          )}
        </div>

        {selectedWallet && (
          <div>
            <span>User wallet: {userAccount}</span>
          </div>
        )}
      </section>
    </div>
  )
}
export default DiscoverWalletProviders
