import { useEffect, useState } from "react"
import InputForm from "../InputForm/InputForm"
import { Balance } from "../../types/blockchain"
import { getBalance } from "../../blockchain/SwapMethods/getBalance"
import { EIP1193Provider } from "../../types/Metamask"

import "./Split.css"
import { blockchain } from "../../blockchain"

interface SplitProps {
  userAccount: string
  chainId: string
  provider: EIP1193Provider
}

const Split = ({ userAccount, chainId, provider }: SplitProps) => {
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("bnb")
  const [to1, setTo1] = useState<string>("eth")
  const [to2, setTo2] = useState<string>("usdt")
  const [percentage1, setPercentage1] = useState<number>(50)
  const [percentage2, setPercentage2] = useState<number>(50)
  const [balance, setBalance] = useState<Balance>({ weiBalance: "", ethBalance: "" })
  const tokens = blockchain.tokens.find(token => token.chainId === chainId)?.tokens as Object
  const tokensNames: string[] = Object.keys(tokens)
  const filteredTokensNameTo = tokensNames.filter(t => t.toLowerCase() !== from.toLowerCase())

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
  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>, token: string) => {
    const value: string = e.target.value
    if (token === "to1") setTo1(value.toLowerCase())
    else setTo2(value.toLowerCase())
  }

  const handlePercentage = (e: React.ChangeEvent<HTMLInputElement>, token: string) => {
    const value: number = Number(e.target.value)
    if (token === "to1") {
      setPercentage1(value)
      setPercentage2(100 - value)
    } else {
      setPercentage2(value)
      setPercentage1(100 - value)
    }
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
        <section className="to-section">
          <h4>To</h4>
          <div>
            <select onChange={e => handleToChange(e, "to1")}>
              {filteredTokensNameTo.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === to1}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <input type="number" placeholder="0.0" value={percentage1} onChange={e => handlePercentage(e, "to1")} />
          </div>
          <div>
            <select onChange={e => handleToChange(e, "to2")}>
              {filteredTokensNameTo.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === to2}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <input type="number" placeholder="0.0" step={"0.01"} max="100" min="0" value={percentage2} onChange={e => handlePercentage(e, "to2")} />
          </div>
        </section>
      </div>
    </section>
  )
}

export default Split
