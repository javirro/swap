import { EIP1193Provider } from "../../types/Metamask"
import "./Admin.css"
interface AdminProps {
  userAccount: string
  chainId: string
  provider: EIP1193Provider
}
const Admin = ({ userAccount, chainId, provider }: AdminProps) => {
  return <section id="admin"></section>
}

const AdminWrapper = ({ userAccount, chainId, provider }: AdminProps) => {
  return <Admin userAccount={userAccount} chainId={chainId} provider={provider} />
}

export default AdminWrapper
