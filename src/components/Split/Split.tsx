import { useEffect, useState } from "react"
import InputForm from "../InputForm/InputForm"
import { Balance } from "../../types/blockchain"
import { getBalance } from "../../blockchain/SwapMethods/getBalance"
import { EIP1193Provider } from "../../types/Metamask"

import "./Split.css"

interface SplitProps {
  userAccount: string
  chainId: string
  provider: EIP1193Provider
}

const Split = ({ userAccount, chainId, provider }: SplitProps) => {
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("bnb")
  const [balance, setBalance] = useState<Balance>({ weiBalance: "", ethBalance: "" })

  useEffect(() => {
    if (!provider) return
    getBalance(provider, from, userAccount, chainId)
      .then((b: Balance) => setBalance(b))
      .catch(e => {
        console.error("Error getting balance", e)
      })
  }, [provider, from, userAccount, chainId])

  const handleMaxAmount = () => {
    setAmount(balance?.ethBalance)
  }
  return (
    <section id="split">
      <div className="input-container">
        <InputForm
          chainId={chainId}
          amount={amount}
          setAmount={setAmount}
          userAccount={userAccount}
          from={from}
          setFrom={setFrom}
          handleMaxAmount={handleMaxAmount}
        />
      </div>
    </section>
  )
}

export default Split
