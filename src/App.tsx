import React, { useState } from "react"
import Swap from "./components/Swap/Swap"
import Navbar, { TabOption } from "./components/Navbar/Navbar"
import { EIP1193Provider } from "./types/Metamask"
import DiscoverWalletProviders from "./components/DetectWallets/DetectWallets"
import { blockchain } from "./blockchain"
import { NetworkData, NetworksChainId } from "./types/blockchain"
import { hexToDecimal } from "./utils/numberConversion"
import Split from "./components/Split/Split"
import Admin from "./components/Admin/Admin"

import "./App.css"


function App() {
  const bnbInfo = blockchain.networks?.find(network => network.chainId === NetworksChainId.bnb) as NetworkData
  const [provider, setProvider] = useState<EIP1193Provider>()
  const [userAccount, setUserAccount] = useState<string>("")
  const [chainId, setChainId] = useState<string>(bnbInfo?.chainId as string)
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [tabOption, setTabOption] = useState<TabOption>("swap")

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
        <DiscoverWalletProviders
          setOpenWalletModal={setOpenWalletModal}
          setProvider={setProvider}
          setUserAccount={setUserAccount}
          userAccount={userAccount}
          chaindId={chainId}
        />
      )}
      <Navbar setOpenWalletModal={setOpenWalletModal} chainId={chainId} userAccount={userAccount} tabOption={tabOption} setTabOption={setTabOption} />
      {tabOption === "swap" && <Swap provider={provider as EIP1193Provider} userAccount={userAccount} chainId={chainId} />}
      {tabOption === "split" && <Split provider={provider as EIP1193Provider} userAccount={userAccount} chainId={chainId} />}
      {tabOption === "admin" && <Admin provider={provider as EIP1193Provider} userAccount={userAccount} chainId={chainId} />}
    </div>
  )
}

export default App
