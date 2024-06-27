import  { Web3 } from "web3"
import { EIP1193Provider } from "../../../types/Metamask"
import { contractsAbi } from ".."
import { addresses } from "../addresses"

const getAdmin =  async (provider: EIP1193Provider): Promise<string> => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(contractsAbi.adminContractAbi as any[], addresses.adminContract)
  const owner: string = await contract.methods.owner().call()
  return owner
}

export default getAdmin