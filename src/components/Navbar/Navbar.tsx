import { formatAddress } from "../../utils/formatAddress"
import "./Navbar.css"
interface NavbarProps {
  setOpenWalletModal: (open: boolean) => void
  userAccount: string
  chainId: string
  isSwap: boolean
  setIsSwap: (isSwap: boolean) => void
}

const Navbar = ({ setOpenWalletModal, userAccount, chainId, isSwap, setIsSwap }: NavbarProps) => {
  const isConnected: boolean = userAccount !== ""
  return (
    <nav>
      <div className="content">
        <strong>Network: {chainId}</strong>
        <div className="buttons">
          <button className={!isSwap ? "not" : "selected"} onClick={() => setIsSwap(true)}>Swap</button>
          <button className={isSwap ? "not" : "selected"} onClick={() => setIsSwap(false)}>Split</button>
        </div>
        {!isConnected ? <button className="connect" onClick={() => setOpenWalletModal(true)}>Connect Wallet </button> : <span> {formatAddress(userAccount)}</span>}
      </div>
    </nav>
  )
}

export default Navbar
