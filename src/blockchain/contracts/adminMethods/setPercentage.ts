import { Web3 } from "web3"
import { EIP1193Provider } from "../../../types/Metamask"
import { contractsAbi } from ".."
import { addresses } from "../addresses"

const setPercentage = async (provider: EIP1193Provider, userAccount: string, percentageA: number) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(contractsAbi.adminContractAbi as any[], addresses.adminContract)
  const tx = await contract.methods.setBptsForPath(percentageA).send({ from: userAccount })
  return tx
}

export default setPercentage
