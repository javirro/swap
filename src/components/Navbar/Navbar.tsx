import { formatAddress } from "../../utils/formatAddress"
import "./Navbar.css"

export type TabOption = "swap" | "split" | "admin"
interface NavbarProps {
  setOpenWalletModal: (open: boolean) => void
  userAccount: string
  chainId: string
  tabOption: TabOption
  setTabOption: (isSwap: TabOption) => void
}

const Navbar = ({ setOpenWalletModal, userAccount, chainId, tabOption, setTabOption }: NavbarProps) => {
  const isConnected: boolean = userAccount !== ""
  return (
    <nav>
      <div className="content">
        <strong>Network: {chainId}</strong>
        <div className="buttons">
          <button className={tabOption !== "swap" ? "not" : "selected"} onClick={() => setTabOption("swap")}>
            Swap
          </button>
          <button className={tabOption !== "split" ? "not" : "selected"} onClick={() => setTabOption("split")}>
            Split
          </button>
          <button className={tabOption !== "admin" ? "not" : "selected"} onClick={() => setTabOption("admin")}>
            Admin
          </button>
        </div>
        {!isConnected ? (
          <button className="connect" onClick={() => setOpenWalletModal(true)}>
            Connect Wallet{" "}
          </button>
        ) : (
          <span> {formatAddress(userAccount)}</span>
        )}
      </div>
    </nav>
  )
}

export default Navbar
