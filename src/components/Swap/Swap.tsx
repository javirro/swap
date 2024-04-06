import { useEffect, useState } from "react";
import { EIP1193Provider } from "../../types/Metamask"
import DiscoverWalletProviders from "../DetectWallets/DetectWallets"
import Web3 from "web3";
import tokenAbi from "../../contracts/tokenAbi.json"
import "./Swap.css";


const Swap = () => {
  const [provider, setProvider] = useState<EIP1193Provider>()

  useEffect(() => {

    const getAccounts2 = async () => {
      if(!provider) return
      const chainId = await provider.request({ method: "eth_chainId" })
      console.log("chainId", chainId);
      const accounts: string[] = await provider.request({ method: "eth_requestAccounts" }) as string[]
      console.log("account2", accounts);
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(tokenAbi, "0x73459845a971490Ba8E1F424A87aA79fad7Ff910")
      const balance = await contract.methods.balanceOf(accounts[0]).call()
      const approveTx = await contract.methods.approve("0x73459845a971490Ba8E1F424A87aA79fad7Ff910", "1000000000000000000").send({from: accounts[0]})
      console.log("balance", balance);
      console.log("approveTx", approveTx);
    }
    if (provider) {
      getAccounts2();
    }
  }, [provider]);

  return (
    <section id="swap">
      <DiscoverWalletProviders setProvider={setProvider} />
    </section>
  );
};

export default Swap;
