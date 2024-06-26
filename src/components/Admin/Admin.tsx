import { EIP1193Provider } from '../../types/Metamask'
import './Admin.css'
interface AdminProps {
  userAccount: string
  chainId: string
  provider: EIP1193Provider
}
const Admin = ({ userAccount, chainId, provider }:AdminProps) => {
return(
  <section id="admin">

  </section>
)
}

export default Admin