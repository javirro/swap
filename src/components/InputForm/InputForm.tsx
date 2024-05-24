import { blockchain } from "../../blockchain"
import './InputForm.css'
interface InputFormProps {
  chainId: string
  amount: string
  setAmount: (amount: string) => void
  userAccount: string
  from: string
  setFrom: (from: string) => void
  handleMaxAmount: Function
}
const InputForm = ({ chainId, amount, setAmount, userAccount, from, setFrom, handleMaxAmount }: InputFormProps) => {
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

  return (
    <section id="input">
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
        <button className="max" onClick={() => handleMaxAmount()} disabled={!userAccount}>
          MAX
        </button>
      </div>
    </section>
  )
}

export default InputForm
