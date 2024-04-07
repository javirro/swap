import { useEffect, useState } from "react"
import { EIP1193Provider } from "../../types/Metamask"
import "./Swap.css"

const Swap = () => {
  const [provider, setProvider] = useState<EIP1193Provider>()
  const [userAccount, setUserAccount] = useState<string>("")
  const [chaindId, setChainId] = useState<string>("")



  useEffect(() => {
    const getAccounts2 = async () => {
      if (!provider) return
      const chainId: string = await provider.request({ method: "eth_chainId" }) as string
      setChainId(chainId)
      console.log("chainId", chainId)
      const accounts: string[] = (await provider.request({ method: "eth_requestAccounts" })) as string[]
      console.log("account2", accounts)
      //   const approveTx = await contract.methods.approve("0x73459845a971490Ba8E1F424A87aA79fad7Ff910", "1000000000000000000").send({from: accounts[0]})
      //   console.log("balance", balance);
      //   console.log("approveTx", approveTx);
    }
    if (provider) {
      getAccounts2()
    }
  }, [provider])

  return (
    <section id="swap">

    </section>
  )
}

export default Swap
