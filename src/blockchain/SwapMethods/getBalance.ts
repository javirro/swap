import { Web3 } from "web3"
import { EIP1193Provider } from "../../types/Metamask"
import { tokenNameToAddress } from "../../utils/tokenNameToAddress"
import { contractsAbi } from "../contracts"
import { etherToWeiConverter } from "./tokenHelper"
import { Balance } from "../../types/blockchain"

export const getBalance = async (provider: EIP1193Provider, tokenFromName: string, userAddress: string, chainId: string): Promise<Balance> => {
  const web3 = new Web3(provider)
  const tokenAddress: string = tokenNameToAddress(tokenFromName, chainId)
  if (tokenFromName === "BNB" || tokenFromName === "bnb") {
    const weiBalance = (await web3.eth.getBalance(userAddress)).toString()
    const ethBalance = await web3.utils.fromWei(weiBalance, "ether")
    return { weiBalance, ethBalance }
  } else {
    const contract = new web3.eth.Contract(contractsAbi.tokenAbi, tokenAddress)
    const balance = ((await contract.methods.balanceOf(userAddress).call()) as BigInt).toString()
    const decimals: string = ((await contract.methods.decimals().call()) as BigInt).toString()
    if (decimals === "18") {
      return { weiBalance: balance, ethBalance: web3.utils.fromWei(balance, "ether") }
    } else {
      const ethBalance: string = etherToWeiConverter(balance, decimals)
      return { weiBalance: balance, ethBalance }
    }
  }
}
