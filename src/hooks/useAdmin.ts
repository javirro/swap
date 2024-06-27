import { useEffect, useState } from "react"
import { EIP1193Provider } from "../types/Metamask"
import getAdmin from "../blockchain/contracts/adminMethods/getAdmin"

const useAdmin = (provider: EIP1193Provider) => {
  const [adminAddress, setAdminAddress] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const getContractAdmin = async () => {
      const adminAddress = await getAdmin(provider)
      return adminAddress
    }
    try {
      setLoading(true)
      getContractAdmin().then(adminAddress => {
        setAdminAddress(adminAddress)
      })
    } catch (error) {
      console.error("Error fetching admin address:", error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [provider])
  return { adminAddress, loading, error }
}

export default useAdmin
