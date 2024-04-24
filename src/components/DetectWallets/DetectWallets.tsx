import { useState } from "react"
import useSyncProviders from "../../hooks/useSyncProviders"
import { EIP6963ProviderDetail } from "../../types/Metamask"
import useCloseModalClickOut from "../../hooks/useCloseModalClickOut"
import "./DetectWallets.css"
import { decimalToHex, hexToDecimal } from "../../utils/numberConversion"

interface DiscoverWalletProvidersProps {
  setProvider: (provider: any) => void
  setUserAccount: (userAccount: string) => void
  setOpenWalletModal: (openWalletModal: boolean) => void
  userAccount: string
  chaindId: string
}

const DiscoverWalletProviders = ({ setProvider, setUserAccount, userAccount, chaindId, setOpenWalletModal }: DiscoverWalletProvidersProps) => {
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
  const providers = useSyncProviders()

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    setProvider(providerWithInfo.provider)
    try {
      const accounts: any = await providerWithInfo.provider.request({ method: "eth_requestAccounts" })
      if (accounts?.[0] as string) {
        setSelectedWallet(providerWithInfo)
        setUserAccount(accounts?.[0])
      }
    } catch (error) {
      console.error("Error getting user account", error)
    }

    try {
      const hexChainId = (await providerWithInfo.provider.request({ method: "eth_chainId" })) as string
      if (hexChainId) {
        const userChainId: string = hexToDecimal(hexChainId).toString()
        if (userChainId === chaindId) {
          setTimeout(() => {
            setOpenWalletModal(false)
          }, 1500)
        } else {
          try {
            const hexSelectedChainId: string = decimalToHex(+chaindId)
            await providerWithInfo.provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x" + hexSelectedChainId }] })
          } catch (switchError) {
            console.error("Error switch chain because network is not added to metamask", switchError)
            // try {
            //   await providerWithInfo.provider.request({
            //     method: "wallet_addEthereumChain",
            //     params: [
            //       {
            //         chainId: "0xf00",
            //         chainName: "...",
            //         rpcUrls: ["https://..."] /* ... */,
            //       },
            //     ],
            //   })
            // } catch (addError) {
            //   console.error("Error adding new chain to wallet.", addError)
            // }
          }
        }
      }
    } catch (error) {
      console.error("Error getting chainId", error)
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
            <span>{userAccount}</span>
          </div>
        )}
      </section>
    </div>
  )
}
export default DiscoverWalletProviders
