import { useEffect, useState } from "react"
import { EIP1193Provider } from "../../types/Metamask"
import { blockchain } from "../../blockchain"
import swapExactTokensForTokens from "../../blockchain/SwapMethods/swapExactTokensForTokens"
import swapExactETHForTokens from "../../blockchain/SwapMethods/swapExactETHForTokens"
import { Balance } from "../../types/blockchain"
import { getBalance } from "../../blockchain/SwapMethods/getBalance"

import "./Swap.css"

interface SwapProps {
  provider: EIP1193Provider
  userAccount: string
  chainId: string
}

const Swap = ({ provider, userAccount, chainId }: SwapProps) => {
  const [balance, setBalance] = useState<Balance>({ weiBalance: "", ethBalance: "" })
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("BNB")
  const [to, setTo] = useState<string>("USDT")
  const tokens = blockchain.tokens.find(token => token.chainId === chainId)?.tokens as Object
  const tokensNames = Object.keys(tokens)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrom(e.target.value)
  }

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value)
  }

  useEffect(() => {
    getBalance(provider, from, userAccount, chainId)
      .then((b: Balance) => setBalance(b))
      .catch(e => {
        console.error("Error getting balance", e)
      })
  }, [provider, from, userAccount, chainId])

  console.log(balance)
  const handleSwap = async () => {
    try {
      if (from === "BNB") {
        await swapExactETHForTokens(amount, from, to, provider, userAccount, chainId)
      } else {
        await swapExactTokensForTokens(amount, from, to, provider, userAccount, chainId)
      }
    } catch (error) {
      console.error("Error swapping tokens", error)
    }
  }
  return (
    <section id="swap">
      <div className="input-container">
        <section>
          <h4>From</h4>
          <div>
            <select onChange={handleFromChange}>
              {tokensNames.map(t => (
                <option value={t} key={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <input type="text" placeholder="0.0" value={amount} onChange={handleAmountChange} />
            <button className="max">MAX</button>
          </div>
        </section>
        <section>
          <h4>To</h4>
          <div>
            <select onChange={handleToChange}>
              {tokensNames.map(t => (
                <option value={t} key={t} selected={t === "BNB"}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
      <button onClick={handleSwap} className="swap-btn">Swap</button>
    </section>
  )
}

export default Swap
