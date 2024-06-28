import useAdmin from "../../hooks/useAdmin"
import { EIP1193Provider } from "../../types/Metamask"
import "./Admin.css"
import AdminDashboard from "./AdminDashboard/AdminDashboard"
import NoAdminSplit from "./NoAdminSplit/NoAdminSplit"
export interface AdminProps {
  userAccount: string
  chainId: string
  provider: EIP1193Provider
}
const Admin = ({ userAccount, chainId, provider }: AdminProps) => {
  const { adminAddress, loading, error } = useAdmin(provider)
  if (!loading && adminAddress.toLowerCase() === userAccount.toLowerCase()) {
    return <AdminDashboard userAccount={userAccount} chainId={chainId} provider={provider} />
  }

  return <NoAdminSplit userAccount={userAccount} chainId={chainId} provider={provider} />
}

const AdminWrapper = ({ userAccount, chainId, provider }: AdminProps) => {
  if (!userAccount) return <section id="admin">
    <h3>Please connect your wallet to access the admin panel</h3>
  </section>
  return <Admin userAccount={userAccount} chainId={chainId} provider={provider} />
}

export default AdminWrapper
