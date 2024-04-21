import { useEffect, useState } from "react"
import { EIP1193Provider } from "../../types/Metamask"
import { blockchain } from "../../blockchain"
import swapExactTokensForTokens from "../../blockchain/SwapMethods/swapExactTokensForTokens"
import depositBNB from "../../blockchain/SwapMethods/depositBNB"
import { Balance } from "../../types/blockchain"
import { getBalance } from "../../blockchain/SwapMethods/getBalance"
import withdrawBNB, { getWbnbReceived } from "../../blockchain/SwapMethods/withdrawBNB"
import "./Swap.css"

interface SwapProps {
  provider: EIP1193Provider
  userAccount: string
  chainId: string
}

const Swap = ({ provider, userAccount, chainId }: SwapProps) => {
  const [balance, setBalance] = useState<Balance>({ weiBalance: "", ethBalance: "" })
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("bnb")
  const [to, setTo] = useState<string>("usdt")
  const tokens = blockchain.tokens.find(token => token.chainId === chainId)?.tokens as Object
  const tokensNames: string[] = Object.keys(tokens)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const splited = value.split(".")
    if (splited.length > 1 && splited[1].length > 9) return
    setAmount(e.target.value)
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: string = e.target.value
    setFrom(value.toLowerCase())
  }

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: string = e.target.value
    setTo(value.toLowerCase())
  }

  useEffect(() => {
    if(!provider) return
    getBalance(provider, from, userAccount, chainId)
      .then((b: Balance) => setBalance(b))
      .catch(e => {
        console.error("Error getting balance", e)
      })
  }, [provider, from, userAccount, chainId])

  const handleSwap = async () => {
    try {
      if (from === "bnb") {
        await depositBNB(amount, userAccount, provider)
        await swapExactTokensForTokens(amount, "wbnb", to, provider, userAccount, chainId)
      } else if (to === "bnb") {
        const swapTx = await swapExactTokensForTokens(amount, from, "wbnb", provider, userAccount, chainId)
        const wbnbAmount = getWbnbReceived(swapTx, userAccount)
        await withdrawBNB(wbnbAmount?.toString(), userAccount, provider)
      } else {
        await swapExactTokensForTokens(amount, from, to, provider, userAccount, chainId)
      }
    } catch (error) {
      console.error("Error swapping tokens", error)
    }
  }
  const handleMaxAmount = () => {
    setAmount(balance?.ethBalance)
  }
  return (
    <section id="swap">
      <div className="input-container">
        <section>
          <h4>From</h4>
          <div>
            <select onChange={handleFromChange}>
              {tokensNames.map(t => (
                <option value={t} key={t} selected={t === from}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <input type="text" placeholder="0.0" value={amount} onChange={handleAmountChange} />
            <button className="max" onClick={handleMaxAmount}>
              MAX
            </button>
          </div>
        </section>
        <section>
          <h4>To</h4>
          <div>
            <select onChange={handleToChange}>
              {tokensNames.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === to}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
      <button onClick={handleSwap} className="swap-btn">
        Swap
      </button>
    </section>
  )
}

export default Swap
