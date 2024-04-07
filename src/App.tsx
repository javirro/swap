import React, { useState } from "react"
import Swap from "./components/Swap/Swap"
import Navbar from "./components/Navbar/Navbar"
import { EIP1193Provider } from "./types/Metamask"
import DiscoverWalletProviders from "./components/DetectWallets/DetectWallets"
import { blockchain } from "./blockchain"
import { NetworkData, NetworksChainId } from "./types/blockchain"
import { hexToDecimal } from "./utils/numberConversion"
import "./App.css"

function App() {
  const bnbInfo = blockchain.networks?.find(network => network.chainId === NetworksChainId.bnb) as NetworkData
  const [provider, setProvider] = useState<EIP1193Provider>()
  const [userAccount, setUserAccount] = useState<string>("")
  const [chaindId, setChainId] = useState<string>(bnbInfo?.chainId as string)
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)

  provider?.on?.("accountsChanged", (accounts: any) => {
    setUserAccount(accounts[0])
  })

  provider?.on?.("chainChanged", (hexChainId: any) => {
    const decChainId: string = hexToDecimal(hexChainId).toString()
    setChainId(decChainId)
  })

  return (
    <div className="App">
      {openWalletModal && (
        <DiscoverWalletProviders setOpenWalletModal={setOpenWalletModal} setProvider={setProvider} setUserAccount={setUserAccount} userAccount={userAccount} chaindId={chaindId} />
      )}
      <Navbar setOpenWalletModal={setOpenWalletModal} chainId={chaindId} userAccount={userAccount} />
      <Swap />
    </div>
  )
}

export default App
