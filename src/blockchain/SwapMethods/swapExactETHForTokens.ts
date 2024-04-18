import { EIP1193Provider } from "../../types/Metamask"
import Web3 from "web3"
import { contractsAbi } from "../contracts"
import { addresses } from "../contracts/addresses"
import { getPath } from "./getPath"

const swapExactETHForTokens = async (amountIn: string, from: string, to: string, provider: EIP1193Provider, userAccount: string, chainId: string) => {
  const web3 = new Web3(provider)
  const amountOutMin = "0"
  const fixedAmountIn: string = amountIn.replace(",", ".")
  const amountInWei = web3.utils.toWei(fixedAmountIn, "ether")

  const routerContract = new web3.eth.Contract(contractsAbi.pancakeswapV2RouterAbi, addresses.bscRouterV2)

  const path: string[] = getPath(from, to, chainId)
  const deadline: number = new Date().getTime() + 1000 * 60 * 10
  const gasPrice = await web3.eth.getGasPrice()

  console.log({ amountOutMin, path, userAccount, deadline, gasPrice })
  const tx = await routerContract.methods.swapExactETHForTokens(amountOutMin, path, userAccount, deadline).send({
    gasPrice: gasPrice.toString(),
    value: amountInWei,
    from: userAccount,
  })

  return tx
}

export default swapExactETHForTokens
