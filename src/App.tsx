import React, { useState } from "react"
import Swap from "./components/Swap/Swap"
import Navbar from "./components/Navbar/Navbar"
import { EIP1193Provider } from "./types/Metamask"
import DiscoverWalletProviders from "./components/DetectWallets/DetectWallets"
import "./App.css"


function App() {
  const [provider, setProvider] = useState<EIP1193Provider>()
  const [userAccount, setUserAccount] = useState<string>("")
  const [chaindId, setChainId] = useState<string>("")
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  provider?.on?.("accountsChanged", (accounts: any) => {
    setUserAccount(accounts[0])
  })

  provider?.on?.("chainChanged", (chainId: any) => {
    setChainId(chainId)
  })

  return (
    <div className="App">
      {openWalletModal && <DiscoverWalletProviders setProvider={setProvider} setUserAccount={setUserAccount} userAccount={userAccount} />}
      <Navbar setOpenWalletModal = {setOpenWalletModal}/>
      <Swap />
    </div>
  )
}

export default App
