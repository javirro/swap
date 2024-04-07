import { useState } from "react"
import { EIP1193Provider } from "../../types/Metamask"
import "./Swap.css"

interface SwapProps {
  provider: EIP1193Provider
  userAccount: string
  chainId: string
}

const Swap = ({ provider, userAccount, chainId }: SwapProps) => {
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("ETH")
  const [to, setTo] = useState<string>("ETH")

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrom(e.target.value)
  }

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value)
  }

  console.log({ amount, from, to })
  return (
    <section id="swap">
      <div className="input-container">
        <section>
          <h4>From</h4>
          <div>
            <select onChange={handleFromChange}>
              <option value="ETH">ETH</option>
            </select>
            <input type="text" placeholder="0.0" value={amount} onChange={handleAmountChange} />
          </div>
        </section>
        <section>
          <h4>To</h4>
          <div>
            <select onChange={handleToChange}>
              <option value="ETH">ETH</option>
            </select>
          </div>
        </section>
      </div>
      <button>Swap</button>
    </section>
  )
}

export default Swap
