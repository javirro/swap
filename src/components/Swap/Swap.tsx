import { useEffect, useState } from "react"
import { EIP1193Provider } from "../../types/Metamask"
import { blockchain } from "../../blockchain"
import swapExactTokensForTokens from "../../blockchain/SwapMethods/swapExactTokensForTokens"
import depositBNB from "../../blockchain/SwapMethods/depositBNB"
import { Balance } from "../../types/blockchain"
import { getBalance } from "../../blockchain/SwapMethods/getBalance"
import withdrawBNB, { getWbnbReceived } from "../../blockchain/SwapMethods/withdrawBNB"
import ShowTxHash from "../ShowTxHash/ShowTxHash"
import useDebounceEstimation from "../../hooks/useDebounceEstimation"

import "./Swap.css"
import "../common.css"

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
  const [txHash, setTxHash] = useState<string>("")
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
    if (!provider) return
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
        const tx = await swapExactTokensForTokens(amount, "wbnb", to, provider, userAccount, chainId)
        setTxHash(tx.transactionHash)
      } else if (from === "wbnb" && to === "bnb") {
        const isAmountWei: boolean = false
        const tx = await withdrawBNB(amount, userAccount, provider, isAmountWei)
        setTxHash(tx.transactionHash)
      } else if (to === "bnb") {
        const swapTx = await swapExactTokensForTokens(amount, from, "wbnb", provider, userAccount, chainId)
        const wbnbAmount = getWbnbReceived(swapTx, userAccount)
        const tx = await withdrawBNB(wbnbAmount?.toString(), userAccount, provider)
        setTxHash(tx.transactionHash)
      } else {
        const tx = await swapExactTokensForTokens(amount, from, to, provider, userAccount, chainId)
        setTxHash(tx.transactionHash)
      }
    } catch (error) {
      console.error("Error swapping tokens", error)
    }
  }
  const handleMaxAmount = () => {
    setAmount(balance?.ethBalance)
  }
  const filteredTokensNameTo = tokensNames.filter(t => t.toLowerCase() !== from.toLowerCase())
  const previewOutputA = useDebounceEstimation(amount, from, to, provider, chainId)
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
            <button className="max" onClick={handleMaxAmount} disabled={!userAccount}>
              MAX
            </button>
          </div>
        </section>
        <section>
          <h4>To</h4>
          <div>
            <select onChange={handleToChange}>
              {filteredTokensNameTo.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === to}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="preview-amount">{previewOutputA}</span>
          </div>
        </section>
      </div>
      <button onClick={handleSwap} className="swap-btn" disabled={!userAccount}>
        Swap
      </button>
      {txHash && <ShowTxHash chainId={chainId} txHash={txHash} />}
    </section>
  )
}

export default Swap
