import { Web3 } from "web3"
import { EIP1193Provider } from "../../types/Metamask"
import { contractsAbi } from "../contracts"

const depositBNB = async (amount: string, userAddress: string, provider: EIP1193Provider) => {
  const web3 = new Web3(provider)
  const weiAmount = web3.utils.toWei(amount.toString(), "ether")
  const wbnbContract = new web3.eth.Contract(contractsAbi.wbnbAbi, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
  const depositTx = await wbnbContract.methods.deposit().send({
    from: userAddress,
    value: weiAmount,
  })
  return depositTx
}

export default depositBNB
