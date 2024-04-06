import "./Navbar.css"
interface NavbarProps {
  setOpenWalletModal: (open: boolean) => void
}

const Navbar = ({ setOpenWalletModal }: NavbarProps) => {
  return (
    <nav>
      <button onClick={() => setOpenWalletModal(true)}>Connect Wallet </button>
    </nav>
  )
}

export default Navbar
