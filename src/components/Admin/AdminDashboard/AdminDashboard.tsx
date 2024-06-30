import { useState } from "react"
import { AdminProps } from "../Admin"
import "./AdminDashboard.css"
import { TokenOut } from "../../Split/Split"
import setPercentage from "../../../blockchain/contracts/adminMethods/setPercentage"
import ShowTxHash from "../../ShowTxHash/ShowTxHash"

const AdminDashboard = ({ userAccount, chainId, provider }: AdminProps) => {
  const [percentageA, setPercentageA] = useState<number>(50)
  const [percentageB, setPercentageB] = useState<number>(50)
  const [loading, setLoading] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>("")

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

  const handleUpdatePercentage = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const tx = await setPercentage(provider, userAccount, percentageA)
      setTxHash(tx)
    } catch (error) {
      console.error("Error updating percentages", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <section id="admin">
      <h1>Admin dashboard</h1>

      <div className="middle">
        <form onSubmit={handleUpdatePercentage}>
          <div>
            <input type="number" placeholder="0.0" step={"0.01"} max="100" min="0" value={percentageA} onChange={e => handlePercentage(e, TokenOut.A)} />
            <input type="number" placeholder="0.0" step={"0.01"} max="100" min="0" value={percentageB} onChange={e => handlePercentage(e, TokenOut.B)} />
          </div>
          <button className="update-btn">{!loading ? "Update percentages" : "Updating..."}</button>
        </form>
      </div>
      {txHash && <ShowTxHash chainId={chainId} txHash={txHash} />}
    </section>
  )
}

export default AdminDashboard
