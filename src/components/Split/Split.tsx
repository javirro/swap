import { useEffect, useState } from "react"
import InputForm from "../InputForm/InputForm"
import { Balance } from "../../types/blockchain"
import { getBalance } from "../../blockchain/SwapMethods/getBalance"
import { EIP1193Provider } from "../../types/Metamask"
import { blockchain } from "../../blockchain"
import ShowTxHash from "../ShowTxHash/ShowTxHash"
import { splitExactTokensForTokens } from "../../blockchain/splitMethods/swapExactTokensForTokens"
import { swapETHForSplitTokens } from "../../blockchain/splitMethods/swapETHForSplitTokens"
import { swapTokenForSplitETH } from "../../blockchain/splitMethods/swapTokenForSplitETH"
import "./Split.css"
import "../common.css"



interface SplitProps {
  userAccount: string
  chainId: string
  provider: EIP1193Provider
}

export enum TokenOut {
  A = "A",
  B = "B",
}

const Split = ({ userAccount, chainId, provider }: SplitProps) => {
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("bnb")
  const [tokenOutA, setTokenOutA] = useState<string>("eth")
  const [tokenOutB, setTokenOutB] = useState<string>("usdt")
  const [percentageA, setPercentageA] = useState<number>(50)
  const [percentageB, setPercentageB] = useState<number>(50)
  const [balance, setBalance] = useState<Balance>({ weiBalance: "", ethBalance: "" })
  const [txHash, setTxHash] = useState<string>("")

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
    if (token === TokenOut.A) setTokenOutA(value.toLowerCase())
    else setTokenOutB(value.toLowerCase())
  }

  const handlePercentage = (e: React.ChangeEvent<HTMLInputElement>, token: string) => {
    const value: number = Number(e.target.value)
    if (token === TokenOut.A) {
      setPercentageA(value)
      setPercentageB(100 - value)
    } else {
      setPercentageB(value)
      setPercentageA(100 - value)
    }
  }

  const handleSplit = async () => {
    if (!provider) return
    if (from !== "bnb" && tokenOutA !== "bnb" && tokenOutB !== "bnb") {
      try {
        const tx = await splitExactTokensForTokens({ provider, from, tokenOutA, tokenOutB, percentageA, amount, userAccount, chainId })
        setTxHash(tx.transactionHash)
      } catch (error) {
        console.error("Error splitting tokens", error)
      }
    } else if (from === "bnb") {
      try {
        const tx = await swapETHForSplitTokens({ provider, from, tokenOutA, tokenOutB, percentageA, amount, userAccount, chainId })
        setTxHash(tx.transactionHash)
      } catch (error) {
        console.error("Error splitting tokens when ETH as input", error)
      }
    } else if (tokenOutA === "bnb" || tokenOutB === "bnb") {
      try {
        const tx = await swapTokenForSplitETH({ provider, from, tokenOutA, tokenOutB, percentageA, amount, userAccount, chainId })
        setTxHash(tx.transactionHash)
      } catch (error) {
        console.error("Error splitting tokens when BNB as output", error)
      }
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
            <select onChange={e => handleToChange(e, TokenOut.A)}>
              {filteredTokensNameTo.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === tokenOutA}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <input type="number" placeholder="0.0" step={"0.01"} max="100" min="0" value={percentageA} onChange={e => handlePercentage(e, TokenOut.A)} />
          </div>
          <div>
            <select onChange={e => handleToChange(e, TokenOut.B)}>
              {filteredTokensNameTo.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === tokenOutB}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <input type="number" placeholder="0.0" step={"0.01"} max="100" min="0" value={percentageB} onChange={e => handlePercentage(e, TokenOut.B)} />
          </div>
        </section>
      </div>
      <button onClick={handleSplit} className="split-btn" disabled={!userAccount}>
        Split
      </button>
      {txHash && <ShowTxHash chainId={chainId} txHash={txHash} />}
    </section>
  )
}

export default Split
