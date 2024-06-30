import { useEffect, useState } from "react"
import InputForm from "../../InputForm/InputForm"
import { AdminProps } from "../Admin"
import { Balance } from "../../../types/blockchain"
import { blockchain } from "../../../blockchain"
import { getBalance } from "../../../blockchain/SwapMethods/getBalance"
import { TokenOut } from "../../Split/Split"
import { splitExactTokensForTokensNoAdmin } from "../../../blockchain/contracts/adminMethods/splitExactTokensForTokensNoAdmin"
import { splitTokenForSplitETHNoAdmin } from "../../../blockchain/contracts/adminMethods/splitTokenForSplitETHNoAdmin"
import { splitETHForSplitTokensNoAdmin } from "../../../blockchain/contracts/adminMethods/splitETHForSplitTokensNoAdmin"
import ShowTxHash from "../../ShowTxHash/ShowTxHash"

const NoAdminSplit = ({ userAccount, chainId, provider }: AdminProps) => {
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("bnb")
  const [tokenOutA, setTokenOutA] = useState<string>("eth")
  const [tokenOutB, setTokenOutB] = useState<string>("usdt")
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

  const handleSplit = async () => {
    if (!provider) return
    if (from !== "bnb" && tokenOutA !== "bnb" && tokenOutB !== "bnb") {
      try {
        const tx = await splitExactTokensForTokensNoAdmin({ provider, from, tokenOutA, tokenOutB, amount, userAccount, chainId })
        setTxHash(tx.transactionHash)
      } catch (error) {
        console.error("Error splitting tokens", error)
      }
    } else if (from === "bnb") {
      try {
        const tx = await splitTokenForSplitETHNoAdmin({ provider, from, tokenOutA, tokenOutB, amount, userAccount, chainId })
        setTxHash(tx.transactionHash)
      } catch (error) {
        console.error("Error splitting tokens when ETH as input", error)
      }
    } else if (tokenOutA === "bnb" || tokenOutB === "bnb") {
      try {
        const tx = await splitETHForSplitTokensNoAdmin({ provider, from, tokenOutA, tokenOutB, amount, userAccount, chainId })
        setTxHash(tx.transactionHash)
      } catch (error) {
        console.error("Error splitting tokens when BNB as output", error)
      }
    }
  }
  return (
    <section id="admin">
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
          <section>
          <div>
            <span>Token A</span>
            <select onChange={e => handleToChange(e, TokenOut.A)}>
              {filteredTokensNameTo.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === tokenOutA}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
          <span>Token B</span>
            <select onChange={e => handleToChange(e, TokenOut.B)}>
              {filteredTokensNameTo.map(t => (
                <option value={t.toUpperCase()} key={t} selected={t === tokenOutB}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          </section>
        </section>
      </div>
      <button onClick={handleSplit} className="update-btn" disabled={!userAccount}>
        Split
      </button>
      {txHash && <ShowTxHash chainId={chainId} txHash={txHash} />}
    </section>
  )
}

export default NoAdminSplit
