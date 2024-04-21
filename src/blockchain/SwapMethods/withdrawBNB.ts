import { Web3 } from "web3"
import { EIP1193Provider } from "../../types/Metamask"
import { contractsAbi } from "../contracts"
import { hexToDecimal } from "../../utils/numberConversion"

const withdrawBNB = async (wbnbAmount: string, userAddress: string, provider: EIP1193Provider) => {
  const web3 = new Web3(provider)
  const weiAmount = web3.utils.toWei(wbnbAmount.toString(), "ether")
  const wbnbContract = new web3.eth.Contract(contractsAbi.wbnbAbi, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
  const withdrawTx = await wbnbContract.methods.withdraw(weiAmount).send({ from: userAddress })
  return withdrawTx
}

export default withdrawBNB

export const getWbnbReceived = (txInfo: any, userAddress: string): number => {
  const TRANSFER_TOPIC: string = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  const userAddressWithout0x: string = userAddress.slice(2).toLowerCase()
  const logs = txInfo.logs
  const filteredTransferLogs = logs.filter((log: any) => log.topics[0] === TRANSFER_TOPIC)
  const outputLog = filteredTransferLogs.find((log: any) => log.topics[2].includes(userAddressWithout0x))
  const weiAmount: number = hexToDecimal(outputLog.data)
  return weiAmount
}
